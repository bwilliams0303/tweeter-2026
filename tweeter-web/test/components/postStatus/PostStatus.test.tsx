import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { anything, instance, mock, verify, when } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

jest.mock("../../../src/presenter/PostStatusPresenter", () => ({
  PostStatusPresenter: jest.fn(),
}));

describe("PostStatus", () => {
  const mockUser = new User("Test", "User", "@test", "");
  const mockAuthToken = AuthToken.Generate();
  let mockPresenterObject: PostStatusPresenter;
  let postTextArea: HTMLElement;
  let postStatusButton: HTMLElement;
  let clearButton: HTMLElement;

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      authToken: mockAuthToken,
    });
    mockPresenterObject = mock<PostStatusPresenter>();
    const mockPresenter = instance(mockPresenterObject);
    (PostStatusPresenter as unknown as jest.Mock).mockImplementation(() => mockPresenter);
    when(mockPresenterObject.checkButtonStatus(anything(), anything(), anything(), anything())).thenCall(
      (post: string, authToken: AuthToken | null, currentUser: User | null, isLoading: boolean) =>
        !post.trim() || !authToken || !currentUser || isLoading
    );
  });

  beforeEach(() => {
    render(<PostStatus />);
    postTextArea = screen.getByPlaceholderText("What's on your mind?");
    postStatusButton = screen.getByRole("button", { name: "Post Status" });
    clearButton = screen.getByRole("button", { name: "Clear" });
  });

  it("disables the Post Status and Clear buttons when first rendered", () => {
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons when the text field has text", async () => {
    await userEvent.type(postTextArea, "Hello");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons when the text field is cleared", async () => {
    await userEvent.type(postTextArea, "Hello");

    await userEvent.clear(postTextArea);

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's submitPost with the auth token, user and post when Post Status is pressed", async () => {
    await userEvent.type(postTextArea, "Hello");

    await userEvent.click(postStatusButton);

    verify(mockPresenterObject.submitPost(mockAuthToken, mockUser, "Hello")).once();
  });
});
