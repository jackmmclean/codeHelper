import Container from "react-bootstrap/Container";

import VideoCall from "../../../../../components/Chat/Video/VideoCall";

export default function VideoSelectedTicket({
  studentUsername,
  currentUser,
}: any) {
  return (
    <Container className="d-flex align-items-center justify-content-center">
      <VideoCall studentUsername={studentUsername} currentUser={currentUser} />
    </Container>
  );
}
