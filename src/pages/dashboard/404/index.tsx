import { Button, Result, Row } from "antd";
import Link from "next/link";

export default function NotFound() {
  return (
    <Row className="h-full" justify={"center"} align={"middle"}>
      <div>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Link href="/dashboard">
              <Button type="primary">Back Home</Button>
            </Link>
          }
        />
      </div>
    </Row>
  );
}
