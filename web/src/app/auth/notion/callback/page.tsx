import NotionCallbackClient from "./NotionCallbackClient";

type SearchParams = { [key: string]: string | string[] | undefined };

export default function NotionCallbackPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return <NotionCallbackClient searchParams={searchParams} />;
}
