import "./App.css"
import { Outlet } from "react-router-dom";
import { supabase } from "./supabase";
import { useEffect, useState } from "react";
import { User, UserDetails } from "./model/user";
import { FavoriteCircle } from "./model/circle";
import { KpiExtended } from "./model/kpi";

const initialUser: User = {
  id: "",
  email: "",
};

export default function App() {
  const [user, setUser] = useState<User>(initialUser);
  const [favoriteCircles, setFavoriteCircles] = useState<FavoriteCircle[]>([]);
  const [circles, setCircles] = useState<FavoriteCircle[]>([]);
  const [kpiDefinitions, setKpiDefinitions] = useState<KpiExtended[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    username: null,
    defaultCircleId: null,
  });
  const [circleId, setCircleId] = useState<number | null>(null);

  async function fetchUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser({ id: user.id, email: user.email || "" });
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  }

  const fetchCircles = async () => {
    try {
      let { data: circle, error } = await supabase.from("circle").select("*");
      if (error) {
        throw error;
      }
      setCircles(circle || []);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  async function fetchUserDetails() {
    if (!user.id) return;
    try {
      const { data, error } = await supabase
        .from("username_with_default_circle")
        .select("user_name, circle_id")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setUserDetails({
        username: data.user_name,
        defaultCircleId: data.circle_id,
      });
    } catch (error) {
      console.log("Error getting data:", error);
    }
  }

  async function getFavoriteCircles() {
    if (!user.id) return;
    try {
      const { data, error } = await supabase
        .from("circle")
        .select("circle_name, circle_user!inner(*)")
        .eq("circle_user.user_id", user.id);
      if (error) throw error;
      setFavoriteCircles(data);
    } catch (error) {
      console.log("Error getting data:", error);
    }
  }

  // useEffect(() => {
  //   fetchUserDetails();
  // }, [user.id, userDetails.defaultCircleId]);

  const fetchKpiDefinitions = async () => {
    try {
      let { data: kpi_definition, error } = await supabase
        .from("kpi_definition_with_latest_values")
        .select("*");
      if (error) {
        throw error;
      }
      setKpiDefinitions(kpi_definition || []);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchCircles();
    fetchKpiDefinitions();
  }, []);

  useEffect(() => {
    fetchUser();
    async function fetchData() {
      await fetchUserDetails();
      await getFavoriteCircles();
    }
    if (user.id) {
      fetchData();
    }
  }, [user.id]);

  return (
    <Outlet
      context={{
        setUser,
        favoriteCircles,
        setFavoriteCircles,
        circles,
        setCircles,
        user,
        userDetails,
        setUserDetails,
        kpiDefinitions,
        fetchKpiDefinitions,
        circleId,
        setCircleId,
      }}
    />
  );
}
