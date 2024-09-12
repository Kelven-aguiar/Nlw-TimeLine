import { api } from "@/lib/api";
import { cookies } from "next/headers";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br";
import Image from "next/image";
import Link from "next/link";

dayjs.locale(ptBR);

interface Memory {
	id: string;
	coverUrl: string;
	content: string;
	createdAt: string;
	userId: string;
	isPublic: boolean;
}

export default async function MemoryPage({
	params,
}: { params: { memory: string } }) {
	const { memory: id } = params;

	const token = cookies().get("token")?.value;
	if (!token) {
		return <p>Você precisa estar autenticado para ver esta memória.</p>;
	}

	try {
		const response = await api.get<Memory>(`/memories/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const memory = response.data;

		return (
			<div className="flex flex-col gap-10 p-8">
				<time className="flex items-center gap-2 text-sm text-gray-100 -ml-8 before:h-px before:w-5 before:bg-gray-50">
					{dayjs(memory.createdAt).format("D [de] MMMM [de] YYYY")}
				</time>
				<Image
					src={memory.coverUrl}
					alt="Imagem da memória"
					width={592}
					height={280}
					className="w-full aspect-video object-cover rounded-lg"
				/>
				<p className="text-lg leading-relaxed text-gray-100">
					{memory.content}
				</p>
				<Link href="/" className="text-sm text-gray-200 hover:text-gray-100">
					Voltar para memórias
				</Link>
				<button
					type="submit"
					className="inline-block self-end rounded-full bg-red-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-red-600"
				>
					Deletar memoria
				</button>
			</div>
		);
	} catch (error) {
		return (
			<p>
				Erro ao carregar a memória. Verifique se você tem permissão para
				acessá-la.
			</p>
		);
	}
}
