import { User } from "tweeter-shared";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter<AuthenticationView> {
  public checkSubmitButtonStatus(alias: string, password: string): boolean {
    return !alias || !password;
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string
  ) {
    await this.doAuthenticationOperation(
      () => this.userService.login(alias, password),
      (user: User) => {
        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate(`/feed/${user.alias}`);
        }
      },
      rememberMe,
      "log user in"
    );
  }
}
