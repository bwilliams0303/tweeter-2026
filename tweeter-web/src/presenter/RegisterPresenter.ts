import { Buffer } from "buffer";
import { User } from "tweeter-shared";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
  setImageUrl: (imageUrl: string) => void;
  setImageBytes: (imageBytes: Uint8Array) => void;
  setImageFileExtension: (imageFileExtension: string) => void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  public checkSubmitButtonStatus(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
    imageFileExtension: string
  ): boolean {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !imageFileExtension
    );
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    await this.doAuthenticationOperation(
      () =>
        this.userService.register(
          firstName,
          lastName,
          alias,
          password,
          imageBytes,
          imageFileExtension
        ),
      (user: User) => this.view.navigate(`/feed/${user.alias}`),
      rememberMe,
      "register user"
    );
  }
}
