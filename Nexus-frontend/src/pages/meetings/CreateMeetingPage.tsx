import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

import { createMeeting } from "../../services/meetingService";
import { getUsers } from "../../services/userService";

export const CreateMeetingPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<any[]>([]);

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    [],
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleParticipantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (!value) return;

    if (selectedParticipants.includes(value)) return;

    setSelectedParticipants([...selectedParticipants, value]);
  };

  const removeParticipant = (id: string) => {
    setSelectedParticipants(
      selectedParticipants.filter((participant) => participant !== id),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const participants = selectedParticipants;
      const payload = {
        title: formData.title,
        description: formData.description,
        participants,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };
      console.log(payload);

      const data = await createMeeting(payload);

      if (data.meeting) {
        navigate("/meetings");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to create meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Schedule Meeting</h1>

        <p className="text-gray-600">Create and schedule a new meeting</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
            Meeting Details
          </h2>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* TITLE */}
            <Input
              label="Meeting Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter meeting title"
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
                Create Meeting
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
