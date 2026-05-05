// src/app/(user)/test/[id]/page.js
import { getLiveTestQuestions, getTestMetadata } from "@/actions/userActions";
import LiveTestEngine from "./LiveTestEngine";

export default async function TestPage({ params }) {
    // Extract ID properly for Next.js App router
    const { id } = await params;

    // Fetch data on the server
    const testInfo = await getTestMetadata(id);
    const questions = await getLiveTestQuestions(id);

    if (!testInfo || questions.length === 0) {
        return <div className="p-8 text-center">Test not found or has no questions.</div>;
    }

    // Pass safe data to the Client Component
    return <LiveTestEngine testInfo={testInfo} questions={questions} />;
}