import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold">TIL AI</CardTitle>
            <CardDescription className="text-lg">
              Today I Learned - AI-powered learning notes
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
