import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (followeeCount: number) => void;
  setFollowerCount: (followerCount: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setDisplayedUser: (user: User) => void;
  navigate: (url: string) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this.followService = new FollowService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.followService.getIsFollowerStatus(
            authToken,
            currentUser,
            displayedUser
          )
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.followService.getFolloweeCount(authToken, displayedUser)
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.followService.getFollowerCount(authToken, displayedUser)
      );
    }, "get followers count");
  }

  public switchToLoggedInUser(currentUser: User, currentPath: string) {
    this.view.setDisplayedUser(currentUser);
    this.view.navigate(`${this.getBaseUrl(currentPath)}/${currentUser.alias}`);
  }

  private getBaseUrl(currentPath: string): string {
    const segments = currentPath.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  }

  public async followDisplayedUser(authToken: AuthToken, displayedUser: User) {
    await this.updateFollowStatus(
      () => this.followService.follow(authToken, displayedUser),
      true,
      `Following ${displayedUser.name}...`,
      "follow user"
    );
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ) {
    await this.updateFollowStatus(
      () => this.followService.unfollow(authToken, displayedUser),
      false,
      `Unfollowing ${displayedUser.name}...`,
      "unfollow user"
    );
  }

  private async updateFollowStatus(
    followOperation: () => Promise<
      [followerCount: number, followeeCount: number]
    >,
    isFollower: boolean,
    progressMessage: string,
    operationDescription: string
  ) {
    let progressToastId = "";

    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        progressToastId = this.view.displayInfoMessage(progressMessage, 0);

        const [followerCount, followeeCount] = await followOperation();

        this.view.setIsFollower(isFollower);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      operationDescription,
      () => {
        this.view.deleteMessage(progressToastId);
        this.view.setIsLoading(false);
      }
    );
  }
}
