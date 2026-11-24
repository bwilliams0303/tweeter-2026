import { anything, capture, instance, mock, verify, when } from "@typestrong/ts-mockito";
import { AuthToken, Status, User } from "tweeter-shared";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter";
import { StatusService } from "../../src/model/service/StatusService";

jest.mock("../../src/model/service/StatusService", () => ({
  StatusService: jest.fn(),
}));

describe("PostStatusPresenter", () => {
  let mockViewObject: PostStatusView;
  let mockView: PostStatusView;
  let mockStatusServiceObject: StatusService;
  let mockStatusService: StatusService;
  let presenter: PostStatusPresenter;
  let authToken: AuthToken;
  let currentUser: User;
  const post = "Hello, Tweeter!";
  const toastId = "toast-id";

  beforeEach(() => {
    mockViewObject = mock<PostStatusView>();
    mockView = instance(mockViewObject);
    mockStatusServiceObject = mock<StatusService>();
    mockStatusService = instance(mockStatusServiceObject);
    (StatusService as unknown as jest.Mock).mockImplementation(() => mockStatusService);

    when(mockViewObject.displayInfoMessage(anything(), anything())).thenReturn(toastId);
    authToken = AuthToken.Generate();
    currentUser = new User("Test", "User", "@test", "");
    presenter = new PostStatusPresenter(mockView);
  });

  it("tells the view to display a posting status message", async () => {
    when(mockStatusServiceObject.postStatus(anything(), anything())).thenResolve();

    await presenter.submitPost(authToken, currentUser, post);

    verify(mockViewObject.displayInfoMessage("Posting status...", 0)).once();
  });

  it("calls postStatus on the status service with the status string and auth token", async () => {
    when(mockStatusServiceObject.postStatus(anything(), anything())).thenResolve();

    await presenter.submitPost(authToken, currentUser, post);

    const [capturedToken, capturedStatus] = capture(mockStatusServiceObject.postStatus).last();
    expect(capturedToken).toBe(authToken);
    expect(capturedStatus).toBeInstanceOf(Status);
    expect(capturedStatus.post).toBe(post);
  });

  it("clears the info message, clears the post and displays status posted when posting succeeds", async () => {
    when(mockStatusServiceObject.postStatus(anything(), anything())).thenResolve();

    await presenter.submitPost(authToken, currentUser, post);

    verify(mockViewObject.deleteMessage(toastId)).once();
    verify(mockViewObject.setPost("")).once();
    verify(mockViewObject.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockViewObject.displayErrorMessage(anything())).never();
  });

  it("clears the info message and displays an error but not the cleared post or posted message when posting fails", async () => {
    when(mockStatusServiceObject.postStatus(anything(), anything())).thenReject(new Error("post failed"));

    await presenter.submitPost(authToken, currentUser, post);

    verify(mockViewObject.deleteMessage(toastId)).once();
    verify(mockViewObject.displayErrorMessage(anything())).once();
    verify(mockViewObject.setPost(anything())).never();
    verify(mockViewObject.displayInfoMessage("Status posted!", 2000)).never();
  });
});
