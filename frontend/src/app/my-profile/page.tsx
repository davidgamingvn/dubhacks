"use client";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Spinner } from "~/components/ui/spinner";
import { useState, useEffect, Suspense } from "react";
import Navbar from "~/components/NavBar";

type UserData = {
  name: string | null | undefined;
  email: string | null | undefined;
  avatar: string | null | undefined;
  subjectRatings: {
    math: number;
    science: number;
    history: number;
    english: number;
    art: number;
    physicalEducation: number;
    music: number;
  };
};

export default function UserProfile() {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData>({
    name: user?.name,
    email: user?.email,
    avatar: user?.picture,
    subjectRatings: {
      math: 90,
      science: 85,
      history: 78,
      english: 92,
      art: 88,
      physicalEducation: 95,
      music: 80,
    },
  });

  const userId = user?.sub ? user.sub.split("|")[1] : null;
  console.log(userId);

  useEffect(() => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    async function getProfile() {
      const response = await fetch(
        `http://localhost:4000/api/profile/${userId}`,
        {
          method: "GET",
        },
      );

      const data: UserData = (await response.json()) as UserData;

      setUserData(data);
      console.log(userData.subjectRatings);
    }
    getProfile().catch((error) => {
      console.error("Failed to fetch profile:", error);
    });
  }, []);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<Spinner />}>
        <Navbar />
      </Suspense>
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Card className="overflow-hidden rounded-lg bg-white shadow-xl">
            <CardHeader className="bg-[#FAF17C] py-8 text-center">
              <Avatar className="mx-auto mb-4 h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage
                  src={userData.avatar ?? undefined}
                  alt={userData.name ?? undefined}
                />
                <AvatarFallback>
                  <div className="flex flex-col items-center">
                    <Spinner size="large" />
                    Loading avatar
                  </div>
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-3xl font-bold text-gray-800">
                {userData.name}
              </CardTitle>
              <p className="text-gray-600">{userData.email}</p>
            </CardHeader>
            <CardContent className="p-8">
              <div>
                <h3 className="mb-4 text-xl font-bold text-gray-800">
                  Subject Ratings
                </h3>
                <div className="space-y-4">
                  {Object.entries(userData.subjectRatings)
                    .slice(0, -1)
                    .map(([subject, rating]) => (
                      <div key={subject}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {capitalizeFirstLetter(subject)}
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            {rating}%
                          </span>
                        </div>
                        <Progress
                          value={rating}
                          className="h-2 bg-primary/60"
                        />
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
