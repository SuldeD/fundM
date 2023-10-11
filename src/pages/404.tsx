import { Button, Result, Row } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function NotFound() {
  const { status } = useSession();
  if (status == "loading") {
    return null;
  } else {
    return (
      <Row className="h-full" justify={"center"} align={"middle"}>
        <div>
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
              <Link href="/">
                <Button type="primary">Back Home</Button>
              </Link>
            }
          />
        </div>
      </Row>
    );
  }
}
