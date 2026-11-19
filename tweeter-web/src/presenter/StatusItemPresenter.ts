import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface StatusItemView extends View {
  addItems: (newItems: Status[]) => void;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {
  private _hasMoreItems = true;
  private _lastItem: Status | null = null;
  private userService: UserService;

  protected constructor(view: StatusItemView) {
    super(view);
    this.userService = new UserService();
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(hasMoreItems: boolean) {
    this._hasMoreItems = hasMoreItems;
  }

  protected get lastItem(): Status | null {
    return this._lastItem;
  }

  protected set lastItem(lastItem: Status | null) {
    this._lastItem = lastItem;
  }

  public reset(): void {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
