import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {
  setIsLoading: (isLoading: boolean) => void;
  setPost: (post: string) => void;
  displayInfoMessage: (message: string, duration: number) => string;
  displayErrorMessage: (message: string) => void;
  deleteMessage: (messageId: string) => void;
}

export class PostStatusPresenter {
  private view: PostStatusView;
  private statusService: StatusService;

  public constructor(view: PostStatusView) {
    this.view = view;
    this.statusService = new StatusService();
  }

  public checkButtonStatus(
    post: string,
    authToken: AuthToken | null,
    currentUser: User | null,
    isLoading: boolean
  ): boolean {
    return !post.trim() || !authToken || !currentUser || isLoading;
  }

  public async submitPost(
    authToken: AuthToken,
    currentUser: User,
    post: string
  ) {
    let postingStatusToastId = "";

    try {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0
      );

      const status = new Status(post, currentUser, Date.now());

      await this.statusService.postStatus(authToken, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
    }
  }
}
