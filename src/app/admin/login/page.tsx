import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Entrar — Painel do batizado", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center px-5 py-10">
      <p className="text-center font-script text-[48px] leading-none text-ouro">Painel</p>
      <p className="mt-2 text-center text-tinta/70">Batizado de Anthony Gael</p>
      <LoginForm />
    </main>
  );
}
