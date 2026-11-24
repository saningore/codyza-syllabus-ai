
"use client";

import { useState } from "react";

type Course = {
  id: string;
  code: string;
  name: string;
  credits: string;
  professor: string;
  grade: string;
  syllabus: File | null;
};

type Semester = {
  id: string;
  term: string;
  year: string;
  startDate: string;
  endDate: string;
  courses: Course[];
};

type TranscriptResult = {
  id: string;
  code: string;
  name: string;
  credits: string;
  grade: string;
  semester: string;
  status: "matched" | "missing" | "mismatch";
};

export default function SemestersPage() {
  const [semesters, setSemesters] = useState<Semester[]>([
    {
      id: crypto.randomUUID(),
      term: "Fall",
      year: "2027",
      startDate: "",
      endDate: "",
      courses: [],
    },
  ]);

  const [scheduleFiles, setScheduleFiles] = useState<
    Record<string, File | null>
  >({});

  const [transcript, setTranscript] = useState<File | null>(null);

  const [transcriptResults, setTranscriptResults] = useState<
    TranscriptResult[]
  >([]);

  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const [selectedResults, setSelectedResults] = useState<string[]>([]);

  // --------------------------------
  // SEMESTER MANAGEMENT
  // --------------------------------

  function updateSemester(
    id: string,
    field: "term" | "year" | "startDate" | "endDate",
    value: string
  ) {
    setSemesters((previous) =>
      previous.map((semester) =>
        semester.id === id
          ? { ...semester, [field]: value }
          : semester
      )
    );
  }

  function addSemester() {
    setSemesters((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        term: "Spring",
        year: "2028",
        startDate: "",
        endDate: "",
        courses: [],
      },
    ]);
  }

  function deleteSemester(id: string) {
    if (!confirm("Are you sure you want to delete this semester and its courses?")) {
      return;
    }

    setSemesters((previous) =>
      previous.filter((semester) => semester.id !== id)
    );
  }

  // --------------------------------
  // COURSE MANAGEMENT
  // --------------------------------

  function addCourse(semesterId: string) {
    const newCourse: Course = {
      id: crypto.randomUUID(),
      code: "",
      name: "",
      credits: "",
      professor: "",
      grade: "",
      syllabus: null,
    };

    setSemesters((previous) =>
      previous.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              courses: [...semester.courses, newCourse],
            }
          : semester
      )
    );
  }

  function updateCourse(
    semesterId: string,
    courseId: string,
    field: keyof Course,
    value: string | File | null
  ) {
    setSemesters((previous) =>
      previous.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              courses: semester.courses.map((course) =>
                course.id === courseId
                  ? { ...course, [field]: value }
                  : course
              ),
            }
          : semester
      )
    );
  }

  function deleteCourse(semesterId: string, courseId: string) {
    setSemesters((previous) =>
      previous.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              courses: semester.courses.filter(
                (course) => course.id !== courseId
              ),
            }
          : semester
      )
    );
  }

  // --------------------------------
  // TRANSCRIPT MANAGEMENT
  // --------------------------------

  function handleTranscriptSelection(file: File | null) {
    setTranscript(file);
    setTranscriptResults([]);
    setAnalysisComplete(false);
    setAnalysisError("");
    setSelectedResults([]);
  }

  async function analyzeTranscript() {
    if (!transcript) return;

    setAnalyzing(true);
    setAnalysisError("");

    try {
      const formData = new FormData();
      formData.append("transcript", transcript);

      // This endpoint must be implemented on the server.
      const response = await fetch("/api/transcripts/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to analyze transcript."
        );
      }

      const results: TranscriptResult[] = data.results;

      if (!Array.isArray(results)) {
        throw new Error("Invalid transcript analysis response.");
      }

      setTranscriptResults(results);
      setSelectedResults(
        results
          .filter((result) => result.status !== "matched")
          .map((result) => result.id)
      );
      setAnalysisComplete(true);

    } catch (error) {
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing your transcript."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  // --------------------------------
  // MATCH TRANSCRIPT COURSES
  // --------------------------------

  function addMissingCourses() {
    const missingResults = transcriptResults.filter(
      (result) =>
        selectedResults.includes(result.id) &&
        result.status === "missing"
    );

    setSemesters((previous) => {
      const updated = [...previous];

      missingResults.forEach((result) => {
        const existingCourse = updated.some((semester) =>
          semester.courses.some(
            (course) =>
              course.code.trim().toLowerCase() ===
              result.code.trim().toLowerCase()
          )
        );

        if (existingCourse) return;

        // Only add a course to a semester that matches
        // the transcript's semester label.
        const target = updated.find(
          (semester) =>
            `${semester.term} ${semester.year}`.toLowerCase() ===
            result.semester.trim().toLowerCase()
        );

        if (!target) return;

        target.courses.push({
          id: crypto.randomUUID(),
          code: result.code,
          name: result.name,
          credits: result.credits,
          professor: "",
          grade: result.grade,
          syllabus: null,
        });
      });

      return updated;
    });

    alert(
      "Selected courses have been added where a matching semester exists. Review your planner."
    );
  }

  const totalCourses = semesters.reduce(
    (total, semester) => total + semester.courses.length,
    0
  );

  const totalCredits = semesters.reduce(
    (total, semester) =>
      total +
      semester.courses.reduce(
        (sum, course) => sum + (Number(course.credits) || 0),
        0
      ),
    0
  );

  const matchedCount = transcriptResults.filter(
    (result) => result.status === "matched"
  ).length;

  const missingCount = transcriptResults.filter(
    (result) => result.status === "missing"
  ).length;

  const mismatchCount = transcriptResults.filter(
    (result) => result.status === "mismatch"
  ).length;

  // --------------------------------
  // PAGE
  // --------------------------------

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-8">

      <div className="mx-auto max-w-6xl space-y-8">

        {/* PAGE HEADER */}

        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Semesters
            </h1>

            <p className="mt-1 text-gray-500">
              Organize your academic journey.
            </p>
          </div>

          <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm text-indigo-700">
            Academic Planner
          </span>
        </header>

        {/* OVERALL SUMMARY */}

        <section className="grid gap-4 sm:grid-cols-3">

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Semesters
            </p>
            <p className="mt-2 text-3xl font-bold">
              {semesters.length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Courses
            </p>
            <p className="mt-2 text-3xl font-bold">
              {totalCourses}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Credits
            </p>
            <p className="mt-2 text-3xl font-bold">
              {totalCredits}
            </p>
          </div>

        </section>

        {/* SEMESTER CONTAINERS */}

        {semesters.map((semester) => {
          const semesterCredits = semester.courses.reduce(
            (total, course) =>
              total + (Number(course.credits) || 0),
            0
          );

          return (
            <section
              key={semester.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >

              {/* SEMESTER HEADER */}

              <div className="p-6">

                <div className="flex flex-wrap items-center justify-between gap-4">

                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {semester.term} {semester.year}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {semester.courses.length} Courses
                      {" · "}
                      {semesterCredits} Credits
                    </p>
                  </div>

                  <button
                    onClick={() => deleteSemester(semester.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Delete Semester
                  </button>

                </div>

                {/* SEMESTER DETAILS */}

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Term
                    </label>

                    <select
                      value={semester.term}
                      onChange={(e) =>
                        updateSemester(
                          semester.id,
                          "term",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border bg-white p-3"
                    >
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                      <option value="Fall">Fall</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Academic Year
                    </label>

                    <input
                      type="number"
                      value={semester.year}
                      onChange={(e) =>
                        updateSemester(
                          semester.id,
                          "year",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={semester.startDate}
                      onChange={(e) =>
                        updateSemester(
                          semester.id,
                          "startDate",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      End Date
                    </label>

                    <input
                      type="date"
                      value={semester.endDate}
                      onChange={(e) =>
                        updateSemester(
                          semester.id,
                          "endDate",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border p-3"
                    />
                  </div>

                </div>
              </div>

              {/* COURSES INSIDE SEMESTER */}

              <div className="border-t bg-gray-50 p-6">

                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

                  <div>
                    <h3 className="text-xl font-bold">
                      Courses
                    </h3>

                    <p className="text-sm text-gray-500">
                      Classes registered for {semester.term} {semester.year}.
                    </p>
                  </div>

                  <button
                    onClick={() => addCourse(semester.id)}
                    className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                  >
                    + Add Course
                  </button>

                </div>

                <div className="space-y-4">

                  {semester.courses.map((course, index) => (

                    <details
                      key={course.id}
                      className="overflow-hidden rounded-xl border bg-white shadow-sm"
                    >

                      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-5">

                        <div>
                          <h4 className="font-bold">
                            {course.code || `New Course ${index + 1}`}
                          </h4>

                          <p className="mt-1 text-sm text-gray-500">
                            {course.name || "Enter course name"}
                            {" · "}
                            {course.credits || 0} Credits
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                            {course.grade || "Not graded"}
                          </span>
                          <span className="text-gray-400">▼</span>
                        </div>

                      </summary>

                      <div className="space-y-5 border-t p-5">

                        <div className="flex justify-between">
                          <h5 className="font-semibold">
                            Course Details
                          </h5>

                          <button
                            onClick={() =>
                              deleteCourse(semester.id, course.id)
                            }
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            Delete Course
                          </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">

                          <div>
                            <label className="mb-2 block text-sm font-medium">
                              Course Code
                            </label>

                            <input
                              placeholder="CS 146"
                              value={course.code}
                              onChange={(e) =>
                                updateCourse(
                                  semester.id,
                                  course.id,
                                  "code",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-lg border p-3"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium">
                              Course Name
                            </label>

                            <input
                              placeholder="Data Structures"
                              value={course.name}
                              onChange={(e) =>
                                updateCourse(
                                  semester.id,
                                  course.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-lg border p-3"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium">
                              Credits
                            </label>

                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              placeholder="3"
                              value={course.credits}
                              onChange={(e) =>
                                updateCourse(
                                  semester.id,
                                  course.id,
                                  "credits",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-lg border p-3"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium">
                              Professor
                            </label>

                            <input
                              placeholder="Professor name"
                              value={course.professor}
                              onChange={(e) =>
                                updateCourse(
                                  semester.id,
                                  course.id,
                                  "professor",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-lg border p-3"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-medium">
                              Current Grade
                            </label>

                            <select
                              value={course.grade}
                              onChange={(e) =>
                                updateCourse(
                                  semester.id,
                                  course.id,
                                  "grade",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-lg border p-3"
                            >
                              <option value="">Not graded yet</option>

                              {[
                                "A", "A-", "B+", "B", "B-",
                                "C+", "C", "C-", "D", "F",
                              ].map((grade) => (
                                <option key={grade} value={grade}>
                                  {grade}
                                </option>
                              ))}
                            </select>
                          </div>

                        </div>

                        {/* INDIVIDUAL SYLLABUS */}

                        <div className="border-t pt-5">

                          <label className="mb-3 block font-semibold">
                            Course Syllabus
                          </label>

                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,image/*"
                            onChange={(e) =>
                              updateCourse(
                                semester.id,
                                course.id,
                                "syllabus",
                                e.target.files?.[0] ?? null
                              )
                            }
                            className="block w-full text-sm"
                          />

                          {course.syllabus && (
                            <p className="mt-2 text-sm text-green-600">
                              Selected: {course.syllabus.name}
                            </p>
                          )}

                        </div>

                      </div>

                    </details>

                  ))}

                  {semester.courses.length === 0 && (
                    <div className="rounded-xl border-2 border-dashed bg-white p-10 text-center">

                      <p className="text-lg font-semibold text-gray-700">
                        No courses yet
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        Add your first class to {semester.term} {semester.year}.
                      </p>

                    </div>
                  )}

                </div>

                {/* SEMESTER SCHEDULE IMPORT */}

                <div className="mt-6 rounded-xl border border-dashed border-indigo-300 bg-white p-6">

                  <h4 className="font-bold">
                    Import Class Schedule
                  </h4>

                  <p className="mt-2 text-sm text-gray-500">
                    Upload a screenshot of your university schedule.
                    AI can extract your courses and meeting information.
                  </p>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) =>
                      setScheduleFiles((previous) => ({
                        ...previous,
                        [semester.id]: e.target.files?.[0] ?? null,
                      }))
                    }
                    className="mt-4 block w-full text-sm"
                  />

                  {scheduleFiles[semester.id] && (
                    <p className="mt-2 text-sm text-green-600">
                      {scheduleFiles[semester.id]?.name}
                    </p>
                  )}

                  <button
                    disabled={!scheduleFiles[semester.id]}
                    onClick={() =>
                      alert(
                        "Schedule extraction needs to be connected to your AI backend."
                      )
                    }
                    className="mt-4 rounded-lg bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700 disabled:opacity-40"
                  >
                    Analyze Schedule with AI
                  </button>

                </div>

              </div>

            </section>
          );
        })}

        {/* ADD SEMESTER */}

        <button
          onClick={addSemester}
          className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 font-semibold text-gray-600 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700"
        >
          + Add Another Semester
        </button>

        {/* =====================================
            ACADEMIC TRANSCRIPT VERIFICATION
        ====================================== */}

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* TRANSCRIPT HEADER */}

          <div className="border-b bg-gradient-to-r from-indigo-50 to-white p-6">

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎓</span>

                  <h2 className="text-2xl font-bold text-gray-900">
                    Academic Transcript Verification
                  </h2>
                </div>

                <p className="mt-2 max-w-2xl text-sm text-gray-600">
                  Upload your university transcript to compare your
                  academic history against your semester planner.
                  Identify missing courses, incorrect credits,
                  and grade discrepancies.
                </p>
              </div>

              <span className="rounded-full bg-indigo-100 px-4 py-2 text-xs font-semibold text-indigo-700">
                Global Academic Audit
              </span>

            </div>

          </div>

          <div className="space-y-6 p-6">

            {/* UPLOAD TRANSCRIPT */}

            <div>

              <h3 className="text-lg font-bold text-gray-900">
                Upload Your Transcript
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Upload an unofficial or official transcript in PDF or image format.
              </p>

              <label
                htmlFor="transcript-upload"
                className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
              >

                <span className="text-4xl">📄</span>

                <span className="mt-3 font-semibold text-gray-800">
                  Choose your transcript
                </span>

                <span className="mt-1 text-sm text-gray-500">
                  PDF, PNG, JPG, or JPEG
                </span>

                <span className="mt-4 rounded-lg border bg-white px-5 py-2 text-sm font-medium">
                  Browse Files
                </span>

                <input
                  id="transcript-upload"
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) =>
                    handleTranscriptSelection(
                      e.target.files?.[0] ?? null
                    )
                  }
                />

              </label>

              {transcript && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-gray-50 p-4">

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📑</span>

                    <div>
                      <p className="font-medium text-gray-900">
                        {transcript.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {(transcript.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTranscriptSelection(null)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>

                </div>
              )}

              <button
                disabled={!transcript || analyzing}
                onClick={analyzeTranscript}
                className="mt-5 w-full rounded-lg bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {analyzing
                  ? "Analyzing Transcript..."
                  : "Analyze & Verify Transcript"}
              </button>

              {analysisError && (
                <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {analysisError}
                </p>
              )}

            </div>

            {/* ANALYSIS RESULTS */}

            {analysisComplete && (

              <div className="space-y-6 border-t pt-6">

                <div>
                  <h3 className="text-xl font-bold">
                    Transcript Analysis Results
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Compare your transcript against all semesters in your planner.
                  </p>
                </div>

                {/* RESULT SUMMARY */}

                <div className="grid gap-4 sm:grid-cols-3">

                  <div className="rounded-xl border bg-green-50 p-4">
                    <p className="text-sm text-green-700">
                      Matched Courses
                    </p>

                    <p className="mt-2 text-3xl font-bold text-green-700">
                      {matchedCount}
                    </p>
                  </div>

                  <div className="rounded-xl border bg-yellow-50 p-4">
                    <p className="text-sm text-yellow-700">
                      Missing Courses
                    </p>

                    <p className="mt-2 text-3xl font-bold text-yellow-700">
                      {missingCount}
                    </p>
                  </div>

                  <div className="rounded-xl border bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                      Discrepancies
                    </p>

                    <p className="mt-2 text-3xl font-bold text-red-700">
                      {mismatchCount}
                    </p>
                  </div>

                </div>

                {/* RESULTS TABLE */}

                <div className="overflow-x-auto rounded-xl border">

                  <table className="w-full min-w-[650px] text-left text-sm">

                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4">Course</th>
                        <th className="p-4">Credits</th>
                        <th className="p-4">Grade</th>
                        <th className="p-4">Semester</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Select</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">

                      {transcriptResults.map((result) => (

                        <tr key={result.id}>

                          <td className="p-4">
                            <p className="font-semibold">
                              {result.code}
                            </p>

                            <p className="text-xs text-gray-500">
                              {result.name}
                            </p>
                          </td>

                          <td className="p-4">
                            {result.credits}
                          </td>

                          <td className="p-4">
                            {result.grade}
                          </td>

                          <td className="p-4">
                            {result.semester}
                          </td>

                          <td className="p-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                result.status === "matched"
                                  ? "bg-green-100 text-green-700"
                                  : result.status === "missing"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {result.status === "matched"
                                ? "Matched"
                                : result.status === "missing"
                                  ? "Missing"
                                  : "Mismatch"}
                            </span>
                          </td>

                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedResults.includes(result.id)}
                              disabled={result.status === "matched"}
                              onChange={(e) =>
                                setSelectedResults((previous) =>
                                  e.target.checked
                                    ? [...previous, result.id]
                                    : previous.filter(
                                        (id) => id !== result.id
                                      )
                                )
                              }
                              className="h-4 w-4 accent-indigo-600"
                            />
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

                <div className="rounded-xl border bg-indigo-50 p-4">

                  <h4 className="font-semibold text-indigo-900">
                    Review Before Updating
                  </h4>

                  <p className="mt-1 text-sm text-indigo-800">
                    Only selected missing courses with a matching semester
                    can currently be added. Discrepancies require manual review.
                    Nothing is automatically overwritten.
                  </p>

                  <button
                    onClick={addMissingCourses}
                    disabled={
                      !selectedResults.some((id) =>
                        transcriptResults.some(
                          (result) =>
                            result.id === id &&
                            result.status === "missing"
                        )
                      )
                    }
                    className="mt-4 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-40"
                  >
                    Add Selected Missing Courses
                  </button>

                </div>

              </div>

            )}

            {/* WHAT TRANSCRIPT VERIFICATION DOES */}

            {!analysisComplete && (
              <div className="border-t pt-6">

                <h3 className="font-bold text-gray-900">
                  What SyllabusAI checks
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  {[
                    {
                      icon: "🔎",
                      title: "Course Matching",
                      description:
                        "Compare transcript courses against your semester planner.",
                    },
                    {
                      icon: "📚",
                      title: "Missing Courses",
                      description:
                        "Identify completed courses that aren't recorded in your planner.",
                    },
                    {
                      icon: "📊",
                      title: "Credit Verification",
                      description:
                        "Check whether recorded course credits match your transcript.",
                    },
                    {
                      icon: "🎓",
                      title: "Grade Verification",
                      description:
                        "Identify grade discrepancies and possible duplicate entries.",
                    },
                  ].map((feature) => (

                    <div
                      key={feature.title}
                      className="rounded-xl border bg-gray-50 p-4"
                    >
                      <span className="text-2xl">
                        {feature.icon}
                      </span>

                      <h4 className="mt-2 font-semibold">
                        {feature.title}
                      </h4>

                      <p className="mt-1 text-sm text-gray-500">
                        {feature.description}
                      </p>
                    </div>

                  ))}

                </div>

              </div>
            )}

          </div>

        </section>

      </div>

    </main>
  );
}
