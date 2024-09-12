"use client";

import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteMemoryButtonProps {
	memoryId: string;
	token: string;
}

export default function DeleteMemoryButton({
	memoryId,
	token,
}: DeleteMemoryButtonProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const deleteMemory = async () => {
		try {
			setIsLoading(true);
			setError(null);

			await api.delete(`/memories/${memoryId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			router.push("/");
		} catch (err) {
			setError("Erro ao deletar a memória. Tente novamente mais tarde.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			{error && <p className="text-red-500">{error}</p>}
			<button
				type="button"
				onClick={deleteMemory}
				className="inline-block self-end rounded-full bg-red-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-red-600"
				disabled={isLoading}
			>
				{isLoading ? "Deletando..." : "Deletar Memória"}
			</button>
		</div>
	);
}
