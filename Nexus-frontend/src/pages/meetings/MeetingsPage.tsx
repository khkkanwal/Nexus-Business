import React, { useEffect, useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";

import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

import {
  getMeetings,
  acceptMeeting,
  rejectMeeting,
  deleteMeeting,
} from "../../services/meetingService";

import { useAuth } from "../../context/AuthContext";

const localizer = momentLocalizer(moment);

export const MeetingsPage: React.FC = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [meetings, setMeetings] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const fetchMeetings = async () => {
    try {
      setLoading(true);

      const data = await getMeetings();

      setMeetings(data.meetings || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const events = meetings.map((meeting) => ({
    title: meeting.title,

    start: new Date(meeting.startTime),

    end: new Date(meeting.endTime),

    resource: meeting,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>

          <p className="text-gray-600">Manage your scheduled meetings</p>
        </div>

        <Button onClick={() => navigate("/meetings/create")}>
          Schedule Meeting
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
            Meeting Calendar
          </h2>
        </CardHeader>

        <CardBody>
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming Meetings
          </h2>
        </CardHeader>

        <CardBody>
          {loading ? (
            <p className="text-gray-500">Loading meetings...</p>
          ) : meetings.length === 0 ? (
            <p className="text-gray-500">No meetings found</p>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => {
                const myParticipant = meeting.participants?.find(
                  (p: any) => p.user?._id === user?._id,
                );

                const isOrganizer = meeting.organizer?._id === user?._id;

                return (
                  <div
                    key={meeting._id}
                    className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {meeting.title}
                          </h3>

                          <Badge>{meeting.status}</Badge>
                        </div>

                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                          {meeting.description || "No description provided"}
                        </p>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs font-medium text-gray-500 uppercase">
                              Start Time
                            </p>

                            <p className="text-sm text-gray-800 mt-1">
                              {moment(meeting.startTime).format(
                                "MMMM Do YYYY, h:mm A",
                              )}
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs font-medium text-gray-500 uppercase">
                              End Time
                            </p>

                            <p className="text-sm text-gray-800 mt-1">
                              {moment(meeting.endTime).format(
                                "MMMM Do YYYY, h:mm A",
                              )}
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs font-medium text-gray-500 uppercase">
                              Organizer
                            </p>

                            <p className="text-sm text-gray-800 mt-1">
                              {meeting.organizer?.name}
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs font-medium text-gray-500 uppercase">
                              Participants
                            </p>

                            <p className="text-sm text-gray-800 mt-1">
                              {meeting.participants?.length || 0} Participants
                            </p>
                          </div>
                        </div>

                        {meeting.participants?.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Participants
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {meeting.participants.map((participant: any) => (
                                <div
                                  key={participant.user?._id}
                                  className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs border border-primary-100"
                                >
                                  {participant.user?.name} ({participant.status}
                                  )
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
                      {/* VIEW */}
                      <Button
                        size="sm"
                        onClick={() => navigate(`/meetings/${meeting._id}`)}
                      >
                        View Details
                      </Button>

                      {myParticipant && myParticipant.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={async () => {
                              try {
                                await acceptMeeting(meeting._id);

                                fetchMeetings();
                              } catch (error) {
                                console.log(error);
                              }
                            }}
                          >
                            Accept
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              try {
                                await rejectMeeting(meeting._id);

                                fetchMeetings();
                              } catch (error) {
                                console.log(error);
                              }
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {isOrganizer && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate(`/meetings/${meeting._id}/edit`)
                            }
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="danger"
                            onClick={async () => {
                              const confirmDelete = window.confirm(
                                "Are you sure you want to delete this meeting?",
                              );

                              if (!confirmDelete) return;

                              try {
                                await deleteMeeting(meeting._id);

                                fetchMeetings();
                              } catch (error) {
                                console.log(error);
                              }
                            }}
                          >
                            Delete
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              navigate(`/meetings/${meeting._id}/call`)
                            }
                          >
                            Join Call
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
