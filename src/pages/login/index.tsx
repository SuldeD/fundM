import { getCsrfToken } from "next-auth/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

export default function Login({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  return (
    <div className="bg-black bg-[url('/images/about.png')] bg-cover bg-top bg-no-repeat py-[80px]">
      <div className="container mx-auto">
        <div className="inter text-[40px] font-bold leading-[48px] text-[#fff]">
          Fund Me нэвтрэх
        </div>
        <form
          method="post"
          action="/api/auth/callback/credentials"
          className="max-w-[396px]"
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <label>
            <p className="mt-[25px] pb-[13px] font-inter text-[14px] font-normal leading-[14px] text-[#fff]">
              Гар утасны дугаар оруулах
            </p>
            <input
              className="w-full rounded-[21px] border border-white bg-[#fff] p-3 text-[14px] focus:outline-none"
              name="username"
              type="tel"
              pattern="[6789][0-9]{7}"
              title="Утасны дугаар oruulna uu"
            />
          </label>
          <label>
            <p className="mt-[25px] pb-[13px] font-inter text-[14px] font-normal leading-[14px] text-[#fff]">
              Нууц үг оруулах
            </p>
            <input
              className="w-full rounded-[21px] border border-white bg-[#fff] p-3 text-[14px] focus:outline-none"
              name="password"
              type="password"
            />
          </label>
          <p className="mt-[25px] pb-[13px] text-end font-inter text-[14px] font-normal leading-[14px] text-[#fff]">
            Нууц үгээ мартсан уу ?
          </p>
          <div className="mt-[42px] flex justify-between">
            {" "}
            <input
              onClick={() => router.push("/signup")}
              value="Бүртгүүлэх"
              type="button"
              className="bg-currentColor h-[44px] w-[190px] cursor-pointer rounded-[9px] border-[2px] text-center font-inter text-[#fff]"
            />
            <button
              type="submit"
              className="h-[44px] w-[190px] rounded-[9px] bg-primary text-center font-inter text-[#fff] "
            >
              Нэвтрэх
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
