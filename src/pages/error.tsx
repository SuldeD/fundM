import { Button, Result, Row } from "antd";
import Link from "next/link";

export default function Error() {
  return (
    <Row className="h-full" justify={"center"} align={"middle"}>
      <div>
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong."
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
