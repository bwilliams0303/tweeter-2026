import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface AuthenticationView extends View {
  setIsLoading: (isLoading: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (url: string) => void;
}

export abstract class AuthenticationPresenter<
  V extends AuthenticationView
> extends Presenter<V> {
  private _userService: UserService;

  public constructor(view: V) {
    super(view);
    this._userService = new UserService();
  }

  protected get userService(): UserService {
    return this._userService;
  }

  protected async doAuthenticationOperation(
    authenticate: () => Promise<[User, AuthToken]>,
    navigate: (user: User) => void,
    rememberMe: boolean,
    operationDescription: string
  ): Promise<void> {
    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await authenticate();

        this.view.updateUserInfo(user, user, authToken, rememberMe);
        navigate(user);
      },
      operationDescription,
      () => this.view.setIsLoading(false)
    );
  }
}
