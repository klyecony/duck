import { addToast, Spinner } from "@heroui/react";
import { db } from "@/db";
import { useEffect, useState } from "react";
import { useModalStack } from "@/components/ui/StackedModal";
import EmailForm from "@/components/auth/EmailForm";
import { absoluteCenter } from "@/components/ui/config/utils";
import { NewUser } from "@/components/auth/NewUser";
import { Text } from "@/components/ui/Text";

const Home = () => {
	const [hasShownModal, setHasShownModal] = useState(false);
	const [hasNewUser, setHasNewUser] = useState(false);

	const { isLoading, user, error } = db.useAuth();
	const { add } = useModalStack();

	const { data } = db.useQuery({
		profiles: {
			$: {
				where: {
					id: user?.id || "",
				},
			},
		},
	});

	useEffect(() => {
		const handleLogin = async () => {
			if (error) {
				addToast({
					title: "Ein Fehler ist aufgetreten",
					description: error.message,
					color: "danger",
				});
			} else if (!hasShownModal && !user && !isLoading) {
				add(<EmailForm />, {
					isDismissable: false,
					hideCloseButton: true,
				});
				setHasShownModal(true);
			} else if (!hasNewUser && user && !isLoading) {
				const { data } = await db.queryOnce({
					profiles: {
						$: {
							where: {
								id: user.id || "",
							},
						},
					},
				});
				if (data?.profiles?.length === 0) {
					add(<NewUser />, {
						isDismissable: false,
						hideCloseButton: true,
					});
					setHasNewUser(true);
				}
			}
		};
		handleLogin();
	}, [user, error, isLoading, add, hasShownModal, hasNewUser]);

	const profile = data?.profiles[0];

	return (
		<div className="flex h-full w-full flex-col items-start justify-start py-1 pl-[60px]">
			<div
				className={`${absoluteCenter} transition-opacity ease-in ${isLoading && !user ? "opacity-100 duration-300" : "pointer-events-none opacity-0 duration-75"}`}
			>
				<Spinner color="primary" variant="wave" />
			</div>
			<div className="flex h-1/2 w-full flex-col items-start justify-center px-2 pb-2">
				<Text variant="h3">
					{"Willkommen".split("").map((char, i) => (
						<span
							key={i}
							style={{ transitionDelay: `${i * 75}ms` }}
							className={`inline-block transition-opacity duration-200 ease-in ${profile ? "opacity-100" : "opacity-0"}`}
						>
							{char}
						</span>
					))}
				</Text>
				<Text
					behave="hug"
					variant="h2"
					weight="bold"
					className={`text-primary transition delay-500 duration-500 ease-in ${profile ? "opacity-100 " : "opacity-0 "}`}
				>
					{profile?.name || "Unbekannt"}
				</Text>
				<Text variant="small">ROFLLLLLL</Text>
			</div>
			<div />
		</div>
	);
};

export default Home;
