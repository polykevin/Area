import GoogleCallbackClient from "./GoogleCallbackClient";

type SearchParams = { [key: string]: string | string[] | undefined };

export default function GoogleCallbackPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return <GoogleCallbackClient searchParams={searchParams} />;
}