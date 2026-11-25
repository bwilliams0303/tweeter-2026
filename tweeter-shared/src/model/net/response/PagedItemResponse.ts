// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterResponse } from "./TweeterResponse";

export interface PagedItemResponse<ItemDto> extends TweeterResponse {
  items: ItemDto[] | null;
  hasMore: boolean;
}
