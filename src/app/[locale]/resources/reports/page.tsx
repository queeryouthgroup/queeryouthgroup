import { alegreyaSans, roboto } from "@/ui/fonts"
import { useLocale } from "next-intl"

export default function Page() {
    // const t = useTranslations('publicationPage');
    const lang = useLocale(); 

    return(
        <div className="w-full flex flex-col flex-grow bg-[#fafafc]">
            <div className="flex flex-col items-center min-h-[30vh] mt-4">
                <div className="text-center text-2xl">
                    <h1 className={`${alegreyaSans.className} text-black py-4 font-bold`}>
                        { lang == 'en' ? 'Reports' : 'प्रतिवेदन' }
                    </h1>
                </div>

                <div className={`${roboto.className} text-bg text-justify px-16 py-2 text-black md:mx-64 sm:mx-2`}>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
            </div>
        </div>
    )
}