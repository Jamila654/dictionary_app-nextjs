"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

interface WordDefinition {
  definition: string;
  word: string;
  valid: true;
}

export default function Home() {
  const [inputWord, setinputWord] = useState<string>("");
  const [error, seterror] = useState<string>("");
  const [loading, setloading] = useState<boolean>(false);
  const [wordDefinition, setwordDefinition] = useState<WordDefinition | null>(
    null
  );
  const [recent, setrecent] = useState<string[]>([]);

  useEffect(() => {
    const storedRecent = localStorage.getItem("recentSearches");
    if (storedRecent) {
      setrecent(JSON.parse(storedRecent));
    }
  }, []);

  const searchWord = async (word: string) => {
    seterror("");
    setloading(true);
    try {
      const res = await fetch(
        `https://api.api-ninjas.com/v1/dictionary?word=${word}`,
        { headers: { "X-Api-Key": "lKtqOcitXKlPdf5kvf1ysg==AguhIHwYblypgdyF" } }
      );

      if (!res.ok) {
        seterror("Invalid word");
      }

      const data = await res.json();
      if (data.valid === false) {
        seterror("Incorrect word or word not found.");
      } else {
        setwordDefinition(data);

        const updatedRecent = [data.word, ...recent.filter((w) => w !== data.word)].slice(0, 5);
        setrecent(updatedRecent);
        localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));
      }
    } catch (error) {
      seterror("Incorrect word or word not found.");
    } finally {
      setloading(false);
    }
  };

  const handleSearchBtn = async () => {
    await searchWord(inputWord);
  };

  const handleRecentSearchClick = async (word: string) => {
    setinputWord(word);
    await searchWord(word);
  };

  return (
    <div className="flex items-center justify-center bg-black w-full min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Card>
        <CardHeader>
          <CardTitle>Dictionary App</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="search-icon relative">
            <Input
              placeholder="search here"
              className="pl-10 outline-none focus:border-none"
              value={inputWord}
              onChange={(e) => setinputWord(e.target.value)}
            />
            <Button
              variant="ghost"
              className="absolute top-0 left-[-8px]"
              onClick={handleSearchBtn}
            >
              <CiSearch className="size-6 hover:opacity-55" />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 max-h-[400px]">
          {loading ? (
            <div className="loading w-full flex items-center justify-center">
              <ClipLoader />
            </div>
          ) : (
            ""
          )}
          {error && (
            <div className="error w-full text-red-600 text-center font-bold">
              {error}
            </div>
          )}
          {wordDefinition && (
            <div className="word-definition w-[300px] sm:w-[400px] flex flex-col gap-2 overflow-scroll">
              <h1 className="font-bold text-2xl">{wordDefinition.word}</h1>
              <p>{wordDefinition.definition}</p>
            </div>
          )}

          {!inputWord && recent.length > 0 && (
            <>
              <h1 className="font-bold text-xl">Recent Searches</h1>
              <div className="recent-buttons flex flex-col gap-3">
                {recent.map((word, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="hover:opacity-60"
                    onClick={() => handleRecentSearchClick(word)}
                  >
                    {word}
                  </Button>
                ))}
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}


