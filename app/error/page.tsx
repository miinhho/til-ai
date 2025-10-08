import ServiceDownPage from "@/app/error/_components/ServiceDownPage";
import UnauthenticatedPage from "@/app/error/_components/UnauthenticatedPage";

interface ErrorPageProps {
  params: Promise<{ code: string }>;
}

export default async function ErrorPage({ params }: ErrorPageProps) {
  const code = (await params).code;
  switch (code) {
    case "401":
      return <UnauthenticatedPage />;
    default:
      // 500 에러 포함 모든 에러
      return <ServiceDownPage />;
  }
}
