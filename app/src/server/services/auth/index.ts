import bcrypt from "bcryptjs";
import { prisma } from "@/server/lib/prisma";
import { sendOutwardMail } from "@/server/lib/mailer";
import CustomError from "@/server/models/custom-error";
import { UserRegisterDTO } from "@/app/api/auth/register/route";
import { CREDENTIALS_LOGIN_ERRORS } from "@/common/constants";

export default class AuthService {
  /**
   * Registers a new user in the system.
   * Validates input, checks for existing users, hashes password,
   * creates user record, generates OTP and sends verification email.
   * @param user User registration data containing email, name and password
   * @returns The ID of the created user
   */
  public static async registerUser(user: Required<UserRegisterDTO>) {
    /*
     * 1 - validate the email, name and password
     * 2 - validate if a user with the same email exists
     * 3 - Hash the password
     * 4 - Insert the user in the database
     * 5 - create an otp and insert it into the otp table
     * 6 - mail the otp to the user
     */

    const { email, name, password } = user;

    // 1. Validate the email, name, and password
    if (!this.isValidEmail(email)) {
      throw new CustomError(400, "Invalid email format.");
    }
    if (password.length < 8) {
      throw new CustomError(400, "Password must be at least 8 characters long.");
    }
    if (name?.length < 3) {
      throw new CustomError(400, "Name must be at least 3 characters long.");
    }

    // 2. Validate if a user with the same email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser && existingUser.verified) {
      throw new CustomError(409, "A user with this email already exists");
    }

    // 3. Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10); // Sync method for simplicity

    // 4. Insert the user in the database
    const createdUser = await prisma.user.upsert({
      where: {
        email: email,
      },
      create: {
        email,
        name,
        authProvider: "LOCAL",
        passwordHash: hashedPassword,
        verified: false,
      },
      update: {
        passwordHash: hashedPassword,
      },
    });

    // 5. Create an OTP and insert it into the OTP table
    const otp = this.generateOtp();
    await this.updateOtpInDb(otp, createdUser.id);

    // 6. Mail the OTP to the user
    await this.sendOtpMail(email, otp);

    return createdUser.id;
  }

  /**
   * Validates if a string is in valid email format
   * @param email Email string to validate
   * @returns Boolean indicating if email is valid
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Generates a 6-digit random OTP
   * @returns OTP string
   */
  public static generateOtp(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  }

  /**
   * Updates or creates an OTP record for a user in the database
   * @param otp OTP string to store
   * @param userId ID of the user
   */
  public static async updateOtpInDb(otp: string, userId: string) {
    await prisma.otp.upsert({
      where: {
        userId: userId,
      },
      create: {
        otp,
        userId: userId,
      },
      update: {
        otp,
      },
    });
  }

  /**
   * Sends an OTP verification email to the user
   * @param userEmail Email address of the user
   * @param otp OTP to send
   */
  public static async sendOtpMail(userEmail: string, otp: string) {
    console.log("sending mail");
    await sendOutwardMail(
      userEmail,
      "Account verification Code from PlotExpress",
      `Your PlotExpress verification code is: ${otp}`
    );
    console.log("mail sent");
  }

  /**
   * Retrieves basic user information by user ID
   * @param userId ID of the user
   * @returns User information including name, email, avatar URL and auth provider
   */
  public static async getUserInfo(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        avatarUrl: true,
        authProvider: true,
      },
    });
    return user;
  }

  /**
   * Creates a password reset token and sends a reset link via email
   * @param userEmail Email of the user requesting password reset
   */
  public static async createPasswordResetTokenAndSendMail(userEmail: string) {
    /*
     * Validate that the email belongs to a user
     * Validate that the email belongs to a local user
     * Create a signed token with the user id embedded in it
     * Insert the token in the access tokens table
     * Update it if already present
     * Send a mail to the user with the link to the password reset page
     */

    try {
      // Validate email belongs to a user
      const user = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
      });

      if (!user) {
        throw new CustomError(404, "No user found with this email");
      }

      // Validate user is using local auth
      if (user.authProvider !== "LOCAL") {
        throw new CustomError(
          400,
          "This email is associated with a social login account. Please user a local account."
        );
      }

      // Create reset token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      // Store token in database
      await prisma.accessToken.upsert({
        where: {
          userId: user.id,
        },
        create: {
          token,
          userId: user.id,
          type: "PASSWORD_RESET",
        },
        update: {
          token,
          type: "PASSWORD_RESET",
        },
      });

      // Send password reset email
      console.log("sending password reset mail");
      await sendOutwardMail(
        userEmail,
        "Password Reset Request",
        `Click here to reset your password: ${process.env.NEXT_PUBLIC_APP_URL}/auth/password-reset?key=${token}`
      );
      console.log("password reset mail sent");
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(500, "Failed to process password reset request. Please try again later");
    }
  }

  /**
   * Validates a password reset token
   * @param token Token to validate
   * @returns Boolean indicating if token is valid
   */
  public static async validatePasswordResetToken(token: string) {
    /**
     * 1 - Check if the token exists in the database
     * 2 - Check if the token is of type PASSWORD_RESET
     * 3 - Check if the token is expired
     */
    const accessToken = await prisma.accessToken.findUnique({
      where: {
        token: token,
        type: "PASSWORD_RESET",
      },
    });

    if (!accessToken) {
      throw new CustomError(400, "Invalid or expired token");
    }

    // 2 - Check if the token is expired (10 minutes)
    const tokenExpiryTime = new Date(accessToken.updatedAt).getTime() + 10 * 60 * 1000;
    if (tokenExpiryTime < new Date().getTime()) {
      throw new CustomError(400, "Token has expired");
    }

    return true;
  }

  /**
   * Resets a user's password using a valid reset token
   * @param password New password
   * @param key Reset token
   */
  public static async resetPassword(password: string, key: string) {
    if (password.length < 8) {
      throw new CustomError(400, "Password must be at least 8 characters long.");
    }

    const accessToken = await prisma.accessToken.findUnique({
      where: {
        token: key,
        type: "PASSWORD_RESET",
      },
    });

    if (!accessToken) {
      throw new CustomError(400, "Invalid or expired token");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await prisma.user.update({
      where: { id: accessToken.userId },
      data: { passwordHash: hashedPassword },
    });

    await prisma.accessToken.delete({
      where: { id: accessToken.id },
    });
  }

  /**
   * Resends OTP verification code to user's email
   * @param email Email of the user
   */
  public static async resendOtp(email: string) {
    /*
     * 1 - Check if the email belongs to a user
     * 2 - Check if the user is verified
     * 3 - Check if the user has already requested an OTP
     * 4 - Generate a new OTP
     * 5 - Update the OTP in the database
     * 6 - Send the OTP to the user
     */
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new CustomError(404, "No user found with this email");
    }

    if (user.verified) {
      throw new CustomError(400, "User is already verified");
    }

    const existingOtp = await prisma.otp.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!existingOtp) {
      throw new CustomError(400, "User has not requested an OTP in the first place");
    }

    const otp = this.generateOtp();
    await this.updateOtpInDb(otp, user.id);
    await this.sendOtpMail(email, otp);
  }

  /**
   * Authenticates a user using either password or OTP
   * @param credentials Object containing email and either password or OTP
   * @returns Object containing user ID if authentication successful
   */
  static async authenticateUser(
    credentials?: Record<"email" | "password" | "otp", string>
  ): Promise<{ id: string } | never> {
    if (!credentials || !credentials.email || (!credentials.password && !credentials.otp)) {
      throw new Error(CREDENTIALS_LOGIN_ERRORS.INVALID_CREDENTIALS);
    }

    const { email, password, otp } = credentials;

    switch (true) {
      case Boolean(email && password):
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          throw new Error(CREDENTIALS_LOGIN_ERRORS.EMAIL_NOT_IN_USE);
        }

        if (user.authProvider !== "LOCAL") {
          throw new Error("Email registered using OAUTH. Please use social login");
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash!);
        if (!isValidPassword) {
          throw new Error(CREDENTIALS_LOGIN_ERRORS.INVALID_CREDENTIALS);
        }

        if (!user.verified) {
          const otp = this.generateOtp();
          await this.updateOtpInDb(otp, user.id);
          await this.sendOtpMail(user.email, otp);
          throw new Error(CREDENTIALS_LOGIN_ERRORS.UNVERIFIED_USER);
        }

        return {
          id: user.id?.toString(),
        };
      case Boolean(email && otp):
        const { id } = await AuthService.verifyOtp({ otp, email });
        return { id };
      default:
        throw new Error(CREDENTIALS_LOGIN_ERRORS.INVALID_CREDENTIALS);
    }
  }

  /**
   * Verifies a user's OTP code
   * @param credentials Object containing email and OTP
   * @returns Object containing user ID if verification successful
   */
  static async verifyOtp(credentials?: { otp: string; email: string }): Promise<{ id: string } | never> {
    /*
     * 1 - validate that the user exists and is unverified
     * 2 - get the otp of the user
     * 3 - check if the otp is expired
     * 4 - compare the otps
     * 5 - If the otp is valid, verify the user
     * 6 - delete the OTP from the table
     */
    const { email, otp } = credentials!;

    // 1. Validate that the user exists and is unverified
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new Error("User does not exist.");
    }

    if (user.verified) {
      throw new Error("User is already verified.");
    }

    // 2. Get the OTP of the user
    const userOtp = await prisma.otp.findUnique({
      where: { userId: user.id },
    });

    if (!userOtp) {
      throw new Error("No OTP found for this user.");
    }

    // 3. Check if the OTP is expired. OTP expires after 10 minutes
    const otpExpiryTime = new Date(userOtp.updatedAt).getTime() + 10 * 60 * 1000;
    if (otpExpiryTime < new Date().getTime()) {
      throw new Error("OTP has expired.");
    }

    // 4. Compare the OTPs
    if (userOtp.otp !== otp) {
      throw new Error("Invalid OTP.");
    }

    // 5. If the OTP is valid, verify the user
    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true },
    });

    // 6. Delete the OTP from the table
    await prisma.otp.delete({
      where: { userId: user.id },
    });

    return {
      id: user.id?.toString(),
    };
  }

  /**
   * Handles sign-in process for OAuth providers
   * @param param0 Object containing user and account details from OAuth provider
   * @returns Boolean indicating if sign-in was successful
   */
  static async handleSignIn({ user, account }: { user: any; account: any }) {
    if (!user || !user?.id) throw new Error("Login failed..");

    if (account?.provider === "google") {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser?.authProvider === "LOCAL") {
        throw new Error("Email already registered using email and password.");
      }

      const newUser = await prisma.user.upsert({
        where: {
          email: user.email!,
        },
        create: {
          email: user.email!,
          authProvider: "GOOGLE",
          name: user.name!,
          avatarUrl: user.image,
          verified: true,
        },
        update: {
          name: user.name!,
          avatarUrl: user.image,
        },
      });

      user.id = String(newUser.id);
      return true;
    }

    return true;
  }

  /**
   * Handles session management
   * @param param0 Object containing session and token
   * @returns Updated session object
   */
  static async handleSession({ session, token }: { session: any; token: any }) {
    session.user = { id: token.id as string };
    return session;
  }

  /**
   * Handles JWT token management
   * @param param0 Object containing token and optional user
   * @returns Updated token object
   */
  static async handleJwt({ token, user }: { token: any; user?: any }) {
    if (user) {
      token.id = user.id;
    }
    return token;
  }
}
