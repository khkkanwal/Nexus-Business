import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { getMeetingById, updateMeeting } from "../../services/meetingService";
import { getUsers } from "../../services/userService";

export const EditMeetingPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    [],
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMeeting = async () => {
    try {
      if (!id) return;

      const data = await getMeetingById(id);
      const meeting = data.meeting;

      setFormData({
        title: meeting.title || "",
        description: meeting.description || "",
        startTime: meeting.startTime ? meeting.startTime.slice(0, 16) : "",
        endTime: meeting.endTime ? meeting.endTime.slice(0, 16) : "",
      });

      const participantIds =
        meeting.participants?.map(
          (participant: any) => participant.user?._id,
        ) || [];

      setSelectedParticipants(participantIds);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMeeting();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError(null);
  };

  const handleParticipantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (!value) return;
    if (selectedParticipants.includes(value)) return;

    setSelectedParticipants([...selectedParticipants, value]);
  };

  const removeParticipant = (participantId: string) => {
    setSelectedParticipants(
      selectedParticipants.filter((id) => id !== participantId),
    );
  };

  const validateForm = () => {
    const trimmedTitle = formData.title.trim();

    if (!trimmedTitle) {
      setError("Meeting title is required");
      return false;
    }

    if (trimmedTitle.length < 3) {
      setError("Meeting title must be at least 3 characters");
      return false;
    }

    if (!formData.startTime) {
      setError("Start time is required");
      return false;
    }

    if (!formData.endTime) {
      setError("End time is required");
      return false;
    }

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    const now = new Date();

    if (start < now) {
      setError("Start time cannot be in the past");
      return false;
    }

    if (end <= start) {
      setError("End time must be after start time");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    const isValid = validateForm();

    if (!isValid) return;

    try {
      setLoading(true);

      if (!id) return;

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        participants: selectedParticipants,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      await updateMeeting(id, payload);

      alert("Meeting updated successfully");

      navigate("/meetings");
    } catch (error: any) {
      console.log(error);

      setError(error.message || "Failed to update meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Meeting</h1>
        <p className="text-gray-600">Update your meeting details</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
            Meeting Details
          </h2>
        </CardHeader>

        <CardBody>
          {error && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Meeting Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter meeting title"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>

              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter meeting description"
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Participants
              </label>

              <select
                onChange={handleParticipantChange}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3"
              >
                <option value="">Select participant</option>

                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2 mt-3">
                {selectedParticipants.map((participantId) => {
                  const participant = users.find(
                    (u) => u._id === participantId,
                  );

                  return (
                    <div
                      key={participantId}
                      className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {participant?.name}

                      <button
                        type="button"
                        onClick={() => removeParticipant(participantId)}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DATE/TIME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>

                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>

                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/meetings")}
              >
                Cancel
              </Button>

              <Button type="submit" isLoading={loading}>
                Update Meeting
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
