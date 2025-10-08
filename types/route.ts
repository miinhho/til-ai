import type {
  TILDeleteResponse,
  TILFindByIdResponse,
} from "@/app/api/tils/[id]/route";
import type {
  TILCreateResponse,
  TILFindListResponse,
} from "@/app/api/tils/route";
import type { TILSearchResponse } from "@/app/api/tils/search/route";

type APIRouteMap = {
  GET: {
    "/api/tils/[id]": TILFindByIdResponse;
    "/api/tils/search": TILSearchResponse;
    "/api/tils": TILFindListResponse;
  };
  POST: {
    "/api/tils": TILCreateResponse;
  };
  DELETE: {
    "/api/tils/[id]": TILDeleteResponse;
  };
};

export type APIMethod = keyof APIRouteMap;
export type APIRouteMethod<T extends APIMethod> = APIRouteMap[T];
export type APIRoutePath<T extends APIMethod> = keyof APIRouteMethod<T>;

export type APIRoute<
  Path extends APIRoutePath<Method>,
  Method extends APIMethod,
> = APIRouteMethod<Method>[Path];
