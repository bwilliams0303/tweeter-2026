import { anything, instance, mock, verify, when } from "@typestrong/ts-mockito";
import { AuthToken } from "tweeter-shared";
import { AppNavbarPresenter, AppNavbarView } from "../../src/presenter/AppNavbarPresenter";
import { UserService } from "../../src/model/service/UserService";

jest.mock("../../src/model/service/UserService", () => ({
  UserService: jest.fn(),
}));

describe("AppNavbarPresenter", () => {
  let mockViewObject: AppNavbarView;
  let mockView: AppNavbarView;
  let mockUserServiceObject: UserService;
  let mockUserService: UserService;
  let presenter: AppNavbarPresenter;
  let authToken: AuthToken;
  const toastId = "toast-id";

  beforeEach(() => {
    mockViewObject = mock<AppNavbarView>();
    mockView = instance(mockViewObject);
    mockUserServiceObject = mock<UserService>();
    mockUserService = instance(mockUserServiceObject);
    (UserService as unknown as jest.Mock).mockImplementation(() => mockUserService);

    when(mockViewObject.displayInfoMessage(anything(), anything())).thenReturn(toastId);
    authToken = AuthToken.Generate();
    presenter = new AppNavbarPresenter(mockView);
  });

  it("tells the view to display a logging out message", async () => {
    when(mockUserServiceObject.logout(anything())).thenResolve();

    await presenter.logOut(authToken);

    verify(mockViewObject.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the auth token", async () => {
    when(mockUserServiceObject.logout(anything())).thenResolve();

    await presenter.logOut(authToken);

    verify(mockUserServiceObject.logout(authToken)).once();
  });

  it("clears the info message, user info and navigates to login when logout succeeds", async () => {
    when(mockUserServiceObject.logout(anything())).thenResolve();

    await presenter.logOut(authToken);

    verify(mockViewObject.deleteMessage(toastId)).once();
    verify(mockViewObject.clearUserInfo()).once();
    verify(mockViewObject.navigate("/login")).once();
    verify(mockViewObject.displayErrorMessage(anything())).never();
  });

  it("displays an error and does not clear state or navigate when logout fails", async () => {
    when(mockUserServiceObject.logout(anything())).thenReject(new Error("logout failed"));

    await presenter.logOut(authToken);

    verify(mockViewObject.displayErrorMessage(anything())).once();
    verify(mockViewObject.deleteMessage(anything())).never();
    verify(mockViewObject.clearUserInfo()).never();
    verify(mockViewObject.navigate(anything())).never();
  });
});
