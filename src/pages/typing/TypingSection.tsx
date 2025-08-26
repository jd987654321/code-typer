/**
 * ? CUSTOM RENDERING NOTES
 *  Have an array of words, split by spaces, even for things inside brackets
 *  and a single variable to keep track of the word we are at
 *
 * element renderWords to handle the words
 * element renderCurrentWord to handle the current word
 *
 * currentWordIndex
 *
 * render Words will go thru our array of words, if index !== currentWordIndex, greater -> gray, less -> white
 *
 * renderCurrentWord will break down the word into a bunch of divs, match each letter of the typed word to a
 * letter in the word, if the word is severly mismatched, then we can display a little dropdown with the word they've typed
 *
 *
 */

/**
 * ? Future integrations with shiki
 * keep an array of all the colors of every single letters or space, this way we can just color each span for each
 */

/**
 * ? WPM NOTES
 *
 * how tf does our text rendering work here, so textArr holds a true or false for each word
 * i think the word in the input box gets matched to the letters here
 *
 * so in order to calculate the numbers of letters typed correctly, we can grab the words that are true, and
 * then add (num of words -1) spaces, we also include the number of letters correctly typed out in the input text
 *
 * we also need to account for raw wpm as well, since that might be a cool amount
 */

import { useState, useRef, useEffect, ReactElement, useMemo } from "react";
import refreshButton from "../../assets/refresh.png";
import useSidebarStore, {
  problemTypes,
  languages,
  languageOptions,
} from "@/store/sidebarStore";
import useAuthStore from "@/store/authStore";
import useStore from "@/store/userStore";
import parse, { domToReact, Element, DOMNode, Text } from "html-react-parser";
import { useShallow } from "zustand/shallow";
import { supabase } from "@/supabase/supabase";

type Props = {
  ResetTimer: () => void;
  StartTimer: () => void;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  canType: boolean;
  setCanType: React.Dispatch<React.SetStateAction<boolean>>;
};

type LineElementProps = {
  arrayOfWords: string[];
  spaces: number;
};

export default function TypingSection({
  isActive,
  setIsActive,
  ResetTimer,
  StartTimer,
  canType,
  setCanType,
}: Props): ReactElement {
  const {
    incrementWordIndex,
    incrementLineNum,
    setUserTyped,
    setText,
    setWordIndex,
    setLineNum,
  } = useStore();
  const userTyped = useStore((state) => state.userTyped);
  const spacesArray = useStore((state) => state.spacesArray);
  const wordIndex = useStore((state) => state.wordIndex);
  const lineNum = useStore((state) => state.lineNum);
  const textArray = useStore((state) => state.textArray);

  const style = useSidebarStore((state) => state.style);
  const language = useSidebarStore((state) => state.language);
  const framework = useSidebarStore((state) => state.framework);
  const paradigm = useSidebarStore((state) => state.paradigm);
  const problemType = useSidebarStore((state) => state.problemType);

  const modalOpen = useAuthStore((state) => state.modalOpen);
  const modalOpenRef = useRef(modalOpen);

  const keyPressedRef = useRef("");
  const lineNumRef = useRef(0);
  const wordIndexRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const isActiveRef = useRef<boolean>(isActive);
  const textArrayRef = useRef<string[][] | null>(null);
  const spaceArrayRef = useRef<number[] | null>(null);

  const randIntFrom1toN = (n: number): number =>
    Math.floor(Math.random() * n) + 1;
  const randIntFrom0toN = (n: number): number =>
    Math.floor(Math.random() * n + 1);

  useEffect(() => {
    const focusText = () => {
      inputRef.current?.focus();
    };

    const startTimer = () => {
      if (!isActiveRef.current) {
        // console.log("this is running");
        // console.log("isActive: " + isActive);
        console.log("should start timer now");
        setIsActive(true);
        StartTimer();
      }
    };

    const handleKeydown = () => {
      if (!modalOpenRef.current) {
        focusText();
        startTimer();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    //when when want to query from code, we are querying depending on the...
    //language
    //framework
    //paradigm

    //how do we handle the any options? we will make the selector random, since we know there are always 50
    //pieces of code we will
    async function fetchLeetcodeCode() {
      let currentLanguage = language;
      let currentProblemType = problemType;

      if (currentLanguage === "Any")
        currentLanguage = languages[randIntFrom0toN(languages.length - 1)];
      if (currentProblemType === "Any")
        currentProblemType =
          problemTypes[randIntFrom0toN(problemTypes.length - 1)];

      const { data, error } = await supabase
        .from("leetcode_code")
        .select("*")
        .eq("language", currentLanguage.toLowerCase())
        .eq("category", currentProblemType)
        .eq("numberID", randIntFrom1toN(50));

      if (!data)
        throw new Error(
          "Could not fetch any code with the following properties, language: " +
            currentLanguage +
            " category: " +
            currentProblemType +
            " " +
            error
        );

      console.log(data);

      setText(data[0].code_block);
    }

    async function fetchAppCode() {
      let currentLanguage = language;
      let currentFramework = framework;
      let currentParadigm = paradigm;

      if (currentLanguage === "Any")
        currentLanguage = languages[randIntFrom0toN(languages.length - 1)];
      if (currentFramework === "Any") {
        let frameworkArray = Object.keys(languageOptions[currentLanguage]);
        currentFramework =
          frameworkArray[randIntFrom0toN(frameworkArray.length - 1)];
      }
      if (currentParadigm === "Any") {
        let paradigmOptions = languageOptions[currentLanguage][currentParadigm];
        currentParadigm =
          paradigmOptions[randIntFrom0toN(paradigmOptions.length - 1)];
      }

      const { data, error } = await supabase
        .from("code")
        .select("*")
        .eq("language", currentLanguage.toLowerCase())
        .eq("framework", currentFramework.toLowerCase())
        .eq("paradigm", currentParadigm)
        .eq("numberID", randIntFrom1toN(50));

      // setText(
      //   //'import { ReactElement } from "react";\n\ntype Props = {\n  recordedSpeed: boolean[];\n};\nexport default function FinishedSection({\n  recordedSpeed,\n}: Props): ReactElement {\n  console.log(recordedSpeed);\n  const [hok, setHok] = useState<number>(0);\n  return (\n    <div>\n      <p>Nice job ur done now :D</p>\n      <p>Result: {recordedSpeed.filter(Boolean).length} WPM</p>\n    </div>\n  );\n}\n'
      //   '@SpringBootApplication\npublic class StreamService {\n public static void main(String[] args) {\n SpringApplication.run(StreamService.class, args);\n }\n @Bean\n public RouterFunction<ServerResponse> routes() {\n return RouterFunctions.route()\n .GET("/prime", request -> handlePrime())\n .POST("/compute", this::compute)\n .build();\n }\n private Mono<ServerResponse> handlePrime() {\n return ServerResponse.ok().body(primes(), Integer.class);\n }\n private Flux<Integer> primes() {\n return Flux.range(2, 1000)\n .filter(this::isPrime);\n }\n private boolean isPrime(int n) {\n return IntStream.rangeClosed(2, (int)Math.sqrt(n))\n .allMatch(i -> n % i != 0);\n }\n private Mono<ServerResponse> compute(ServerRequest req) {\n return req.bodyToMono(Operation.class)\n .map(this::apply)\n .flatMap(r -> ServerResponse.ok().bodyValue(r));\n }\n private double apply(Operation op) {\n return switch(op.type()) {\n case ADD -> op.a() + op.b();\n case SUB -> op.a() - op.b();\n case MUL -> op.a() * op.b();\n case DIV -> op.b() == 0 ? Double.NaN : op.a() / op.b();\n };\n }\n private final Supplier<Flux<Long>> timer = () ->\n Flux.interval(Duration.ofSeconds(1));\n public Flux<String> ticks() {\n return timer.get()\n .map(Object::toString)\n .map(s -> "tick-" + s);\n }\n private final Function<String, String> echo = s -> "echo:" + s;\n private final Predicate<Integer> even = n -> n % 2 == 0;\n public Flux<Integer> doubledPrimes() {\n return primes()\n .filter(even)\n .map(i -> i * 2);\n }\n public Mono<String> echoMono(String input) {\n return Mono.just(input)\n .map(echo);\n }\n public Flux<String> streamLines(Path file) {\n return DataBufferUtils.read(file, 4096)\n .map(buf -> buf.toString(StandardCharsets.UTF_8))\n .flatMapMany(s -> Flux.fromArray(s.split("\\n")));\n }\n public Mono<Long> countWords(Path file) {\n return streamLines(file)\n .flatMap(line -> Flux.fromArray(line.split("\\s+")))\n .count();\n }\n public Mono<Void> logEveryTick() {\n return ticks()\n .doOnNext(System.out::println)\n .then();\n }\n public Flux<Long> fibonacci(long bound) {\n return Flux.iterate(new long[]{0, 1},\n arr -> arr[0] + arr[1] < bound,\n arr -> new long[]{arr[1], arr[0] + arr[1]})\n .map(arr -> arr[0]);\n }\n public Mono<List<Integer>> randomSample(int size) {\n return Flux.range(0, size)\n .map(i -> ThreadLocalRandom.current().nextInt())\n .collectList();\n }\n public Supplier<Mono<Long>> primeCountSupplier() {\n return () -> primes().count();\n }\n public Mode parseMode(String s) {\n return Mode.valueOf(s.toUpperCase());\n }\n private String format(double v) {\n return String.format("%.2f", v);\n }\n public record Operation(String type, double a, double b) {}\n public enum Mode { ADD, SUB, MUL, DIV }\n}'
      // );

      if (!data)
        throw new Error(
          "Could not fetch any code with the following properties, language: " +
            currentLanguage +
            " framework: " +
            currentFramework +
            " paradigm: " +
            currentParadigm
        );

      //console.log(data);
      setText(data[0].code_block);
    }

    console.log(style);

    if (style === "App Code") {
      fetchAppCode();
    } else if (style === "Leetcode") {
      fetchLeetcodeCode();
    } else
      throw new Error(
        "The style variable should be either 'App Code' or 'Leetcode', it is currently: " +
          style
      );
  }, [language, framework, paradigm, style]);

  useEffect(() => {
    modalOpenRef.current = modalOpen;
  }, [modalOpen]);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    lineNumRef.current = lineNum;
  }, [lineNum]);

  useEffect(() => {
    textArrayRef.current = textArray;
  }, [textArray]);

  useEffect(() => {
    wordIndexRef.current = wordIndex;
    if (
      textArrayRef.current &&
      wordIndexRef.current >= textArrayRef.current?.[lineNumRef.current].length
    ) {
      setWordIndex(0);
      incrementLineNum();
    }
  }, [wordIndex]);

  const createSpaces = (spaces: number) => {
    return " "
      .repeat(spaces)
      .split("")
      .map((value, index) => (
        <span key={value + index + "extraSpaces"}>{`  `}</span>
      ));
  };

  const RenderCurrentWord = ({
    text,
    userTyped,
  }: {
    text: string;
    userTyped: string;
  }) => {
    let foundIncorrectLetter = false;
    //so we have userText, we match each letter of userText to the currentword
    //our current logic is just tracking the number of correct letters in the incorrect word
    //but now we will be following monkeytypes system which I think makes the most sense
    //we track the entire word, if we are >= userTyped.length then we just default to gray as untyped
    //in the case of userTyped.length > text.length, then we instead render the userTyped word, following
    //the same logic
    //thus we dont be needing to track the correct or incorrect word
    if (userTyped.length > text.length) {
      return (userTyped + " ").split("").map((value, index) => {
        let textColor = "";
        if (index == userTyped.length) {
          console.log("first half");
        }

        if (index >= text.length) {
          textColor = "text-red-950";
        } else if (userTyped[index] !== text[index]) {
          textColor = "text-red-700";
        } else {
          textColor = "text-white";
        }

        if (index >= text.length) {
          return (
            <span
              key={value + index + "currentWord"}
              className={`${textColor}`}
            >
              {value}
            </span>
          );
        } else {
          return (
            <span
              key={value + index + "currentWord"}
              className={`${textColor}`}
            >
              {text[index]}
            </span>
          );
        }
      });
    } else {
      return (text + " ").split("").map((value, index) => {
        let textColor = "";

        if (index >= userTyped.length) {
          textColor = "text-gray-700";
        } else if (userTyped[index] !== text[index]) {
          textColor = "text-red-700";
        } else {
          textColor = "text-white";
        }

        return (
          <span key={value + index} className={`${textColor}`}>
            {value}
          </span>
        );
      });
    }

    // return (
    //   <span>
    //     {(text + " ").split("").map((value, index) => {
    //       const key = value.toString() + index;
    //       if (foundIncorrectLetter || userTyped[index] !== value) {
    //         foundIncorrectLetter = true;
    //         return (
    //           <span key={key} className="text-gray-700">
    //             {value}
    //           </span>
    //         );
    //       } else {
    //         return (
    //           <span key={key} className="text-white">
    //             {value}
    //           </span>
    //         );
    //       }
    //     })}
    //   </span>
    // );
  };

  const RenderTypedLine = ({ arrayOfWords, spaces }: LineElementProps) => {
    return (
      <div className="whitespace-pre">
        {createSpaces(spaces)}
        {arrayOfWords.map((value, index) => (
          <span
            key={value.toString() + index + "typedLine"}
            className="text-white"
          >{`${value} `}</span>
        ))}
      </div>
    );
  };

  const RenderUntypedLine = ({ arrayOfWords, spaces }: LineElementProps) => {
    return (
      <div className="whitespace-pre">
        {createSpaces(spaces)}
        {arrayOfWords.map((value, index) => (
          <span
            key={value.toString() + index + "untypedLine"}
            className="text-gray-700"
          >{`${value} `}</span>
        ))}
      </div>
    );
  };

  const RenderCurrentLine = ({
    userTyped,
    arrayOfWords,
    spaces,
    currentWordIndex,
  }: LineElementProps & { userTyped: string; currentWordIndex: number }) => {
    return (
      <div className="whitespace-pre">
        {createSpaces(spaces)}
        {arrayOfWords.map((value, index) => {
          const key = value.toString() + index + "currentLine";
          if (index < currentWordIndex) {
            return <span key={key} className="text-white">{`${value} `}</span>;
          } else if (index > currentWordIndex) {
            return (
              <span key={key} className="text-gray-700">{`${value} `}</span>
            );
          } else {
            return (
              <RenderCurrentWord
                key={key}
                text={arrayOfWords[currentWordIndex]}
                userTyped={userTyped}
              />
            );
          }
        })}
      </div>
    );
  };

  //we could do two things to show incorrect text, either expand the text with extra words
  //

  const RenderText = ({
    formattedTextArray,
    lineNum,
    wordIndex,
    spacesArray,
  }: {
    formattedTextArray: string[][] | null;
    lineNum: number;
    wordIndex: number;
    spacesArray: number[] | null;
  }) => {
    return (
      <div className="w-[700px overflow-hidden">
        <div
          style={{
            //40 comes from space between and span height, 24 and 16 respectively
            transform: `translateY(-${(24 + 0) * lineNum}px)`,
          }}
          className="transition-transform duration-300"
        >
          {!formattedTextArray || !spacesArray ? (
            <div>Loading...</div>
          ) : (
            formattedTextArray.map((value, index) => {
              const key = value.toString() + index;
              if (index > lineNum) {
                return (
                  <RenderUntypedLine
                    key={key}
                    arrayOfWords={value}
                    spaces={spacesArray[index]}
                  />
                );
              } else if (index < lineNum) {
                return (
                  <RenderTypedLine
                    key={key}
                    arrayOfWords={value}
                    spaces={spacesArray[index]}
                  />
                );
              } else {
                return (
                  <RenderCurrentLine
                    key={key}
                    arrayOfWords={value}
                    spaces={spacesArray[index]}
                    currentWordIndex={wordIndex}
                    userTyped={userTyped}
                  />
                );
              }
            })
          )}
        </div>
      </div>
    );
  };

  /* 
  in order to shift the text upward, we can just offset by a specific amount each time, we can just
  find the constant amount that it shifts up by and update it each time

  */

  return (
    <>
      <div className="w-[90%] text-white bg-none font-vscodeText">
        <RenderText
          formattedTextArray={textArray}
          lineNum={lineNum}
          wordIndex={wordIndex}
          spacesArray={spacesArray}
        />
        <input
          maxLength={100}
          type="text"
          ref={inputRef}
          autoFocus={true}
          className="text-black block w-full h-52 border-black border-2 pointer-events-none fixed z-[-1]"
          value={userTyped}
          onChange={(e) => {
            if (canType) {
              setUserTyped(e.target.value);
              if (
                userTyped.trim() ===
                  textArray?.[lineNumRef.current][wordIndexRef.current] &&
                keyPressedRef.current === " "
              ) {
                incrementWordIndex();
                setUserTyped("");
              }
            }
          }}
          onKeyDown={(e) => {
            keyPressedRef.current = e.key;
          }}
        />
      </div>
      <button
        onClick={() => {
          ResetTimer();
          setCanType(true);
          setWordIndex(0);
          setLineNum(0);
          lineNumRef.current = 0;
          setUserTyped("");
        }}
      >
        <img src={refreshButton} />
      </button>
    </>
  );
}
