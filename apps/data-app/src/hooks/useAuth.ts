import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useDispatch } from "react-redux";
import { setSignedIn, setSignedOut } from "@/features/user/userSlice";

export function useAuth() {
  const { accounts } = useMsal();
  const dispatch = useDispatch();

  useEffect(() => {
    if (accounts.length > 0) {
      const a = accounts[0];
      const claims = a?.idTokenClaims ?? null;

      dispatch(
        setSignedIn({
          userName: a.username,
          name: a.name || "",
          homeAccountId: a.homeAccountId,
          userClaims: claims,
        }),
      );
    } else {
      dispatch(setSignedOut());
    }
  }, [accounts, dispatch]);
}
