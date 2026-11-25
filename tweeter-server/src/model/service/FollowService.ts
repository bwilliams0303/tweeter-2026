// AI-assisted: see AI-ATTRIBUTION.md
import { FakeData, User, UserDto } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const [users, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDto(lastItem),
      pageSize,
      userAlias
    );
    const userDtos = users.map((user) => user.dto);
    return [userDtos, hasMore];
  }
}
