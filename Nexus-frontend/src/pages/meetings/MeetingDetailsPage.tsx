import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";

import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";

import {
  getMeetingById,
  acceptMeeting,
  rejectMeeting,
} from "../../services/meetingService";

import { useAuth } from "../../context/AuthContext";

export const MeetingDetailsPage: React.FC = () => {
  const { id } = useParams();

  const { user } = useAuth();

  const [meeting, setMeeting] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const fetchMeeting = async () => {
    try {
      setLoading(true);

      if (!id) return;

      const data = await getMeetingById(id);

      setMeeting(data.meeting);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeeting();
  }, [id]);

  const handleAccept = async () => {
    try {
      if (!id) return;

      setActionLoading(true);

      await acceptMeeting(id);

      fetchMeeting();
    } catch (error) {
      console.log(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      if (!id) return;

      setActionLoading(true);

      await rejectMeeting(id);

      fetchMeeting();
    } catch (error) {
      console.log(error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading meeting details...</p>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="p-6">
        <p className="text-red-500">Meeting not found</p>
      </div>
    );
  }

  const currentParticipant = meeting.participants?.find(
    (participant: any) => participant.user?._id === user?.id,
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Details</h1>

          <p className="text-gray-600">
            View meeting information and participants
          </p>
        </div>

        <Badge>{meeting.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {meeting.title}
              </h2>

              <p className="text-gray-600 mt-1">{meeting.description}</p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="space-y-6">
          {/* TIME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">Start Time</p>

              <p className="font-medium text-gray-900 mt-1">
                {moment(meeting.startTime).format("MMMM Do YYYY, h:mm A")}
              </p>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">End Time</p>

              <p className="font-medium text-gray-900 mt-1">
                {moment(meeting.endTime).format("MMMM Do YYYY, h:mm A")}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Organizer
            </h3>

            <div className="flex items-center gap-4 border rounded-xl p-4">
              <Avatar
                src={meeting.organizer?.profile?.avatar}
                alt={meeting.organizer?.name}
                size="md"
              />

              <div>
                <p className="font-medium text-gray-900">
                  {meeting.organizer?.name}
                </p>

                <p className="text-sm text-gray-500">
                  {meeting.organizer?.email}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Participants
            </h3>

            <div className="space-y-3">
              {meeting.participants?.map((participant: any) => (
                <div
                  key={participant.user?._id}
                  className="flex items-center justify-between border rounded-xl p-4"
                >
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={participant.user?.profile?.avatar}
                      alt={participant.user?.name}
                      size="md"
                    />

                    <div>
                      <p className="font-medium text-gray-900">
                        {participant.user?.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {participant.user?.email}
                      </p>
                    </div>
                  </div>

                  <Badge>{participant.status}</Badge>
                </div>
              ))}
            </div>
          </div>

          {currentParticipant && currentParticipant.status === "pending" && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleReject}
                isLoading={actionLoading}
              >
                Reject
              </Button>

              <Button onClick={handleAccept} isLoading={actionLoading}>
                Accept
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
