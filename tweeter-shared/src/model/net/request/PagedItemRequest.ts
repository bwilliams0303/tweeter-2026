// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "./TweeterRequest";

export interface PagedItemRequest<ItemDto> extends TweeterRequest {
  token: string;
  userAlias: string;
  pageSize: number;
  lastItem: ItemDto | null;
}
