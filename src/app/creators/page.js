import Head from "next/head";

export default function Creators() {
  return (
    <>
      <Head>
        <title>Креаторы</title>
      </Head>
      <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-start py-16">
        <h1 className="text-4xl font-bold mb-10">КРЕАТОРЫ</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 w-full max-w-6xl">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-48 border border-white rounded-lg flex items-center justify-center text-3xl bg-gray-900"
            >
              🔒
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
