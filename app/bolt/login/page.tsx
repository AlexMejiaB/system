"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Credenciales inválidas")
    } else {
      router.push("/")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-8"
      >
        {/* Logo centrado */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white p-3">
            <Image
              src="/logo.png" // asegurate de tenerlo en /public/logo.png
              alt="Impro Aerospace"
              width={180}
              height={80}
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mt-4">
            Welcome 
          </h1>
          <p className="text-sm text-gray-500">HR Information System</p>
        </div>

        {/* Errores */}
        {error && (
          <p className="text-red-600 mb-4 text-center font-medium">
            {error}
          </p>
        )}

        {/* Inputs */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-700">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1 text-gray-700">Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Sign In
        </button>

       
      </form>
    </div>
  )
}
