// SWR Mutation fetch 함수를 모아둔 파일

export async function postRequest<T = unknown>(
  url: string,
  { arg }: { arg: T },
) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}
