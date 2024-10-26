import React, { useEffect, useState } from "react";
import requestApi from "../../components/utils/axios";
import moment from "moment";
import profile from "../../assets/profile.png";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Select from "react-select";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import "./approvals.css";
import customStyles from "../../components/applayout/selectTheme";

function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [filteredApprovals, setFilteredApprovals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const yearOptions = [
    { value: "I", label: "I" },
    { value: "II", label: "II" },
    { value: "III", label: "III" },
    { value: "IV", label: "IV" },
  ];

  const fetchApprovals = async () => {
    try {
      const response = await requestApi("GET", "/approvals");
      setApprovals(response.data);
      setFilteredApprovals(response.data); // Initialize filtered approvals
    } catch (error) {
      console.error("Error fetching approvals:", error);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApproveClick = (item) => {
    setSelectedItem(item);
    setOpenApproveDialog(true);
  };

  const handleRejectClick = (item) => {
    setSelectedItem(item);
    setOpenRejectDialog(true);
  };

  const handleApprove = async () => {
    try {
      await requestApi("POST", "/skill-approve", {
        student: selectedItem.student,
        id: selectedItem.id,
      });
      setOpenApproveDialog(false);
      setSelectedItem(null);
      fetchApprovals(); // Refresh approvals list
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  const handleReject = async () => {
    try {
      await requestApi("POST", "/app-reject", {
        student: selectedItem.student,
        id: selectedItem.id,
        reason: rejectReason,
      });
      setOpenRejectDialog(false);
      setSelectedItem(null);
      setRejectReason("");
      fetchApprovals(); // Refresh approvals list
    } catch (error) {
      console.error("Error rejecting:", error);
    }
  };

  const handleCloseApproveDialog = () => {
    setOpenApproveDialog(false);
    setSelectedItem(null);
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
    setSelectedItem(null);
    setRejectReason("");
  };

  // Filter approvals based on search term and selected year
  useEffect(() => {
    let filtered = approvals;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.skill.toLowerCase().includes(searchTerm.toLowerCase()) 

      );
    }

    if (selectedYear) {
      filtered = filtered.filter((item) => item.year === selectedYear.value);
    }

    setFilteredApprovals(filtered);
  }, [searchTerm, selectedYear, approvals]);

  return (
    <div style={{display:'flex', flexDirection:'column'}}>

    <div className="filter-section">
            <div style={{flex:'1'}}>
                <TextField
                  label="Search by Name or Reg No"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                />
            </div>
            <br /><br />
            <div style={{flex:'1'}}>
                <Select
                  options={yearOptions}
                  placeholder="Year"
                  value={selectedYear}
                  onChange={setSelectedYear}
                  isClearable
                  className="year-select"
                  styles={customStyles}
                />
            </div>
          </div>
          <br />
    <div className="container">
          
          {filteredApprovals.map((item) => (
            <div className="card" key={item.id}>
              <div className="card-pic">
                <div className="card-pics">
                  <div>
                    <img src={profile} alt="" height="130" />
                  </div>
                  <div className="card-body">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="card-header">
                        {item.name} - {item.student}
                      </div>
                    </div>
                    <div>
                      {item.year} - {item.department}
                    </div>
                    <div className="project"> {item.p_title}</div>
                    <div>
                      <strong>Tech Stack:</strong> {item.skill}
                    </div>
                    <br />
                    <div style={{ lineHeight: "20px" }}>
                      {item.date
                        ? moment(item.date).format("DD/MM/YYYY")
                        : "No Date"}{" "}
                      <br />
                      {item.date ? moment(item.date).format("HH:mm:ss") : "No Time"}
                    </div>
                  </div>
                </div>
                <div className="ar-button">
                  <button
                    style={{ flex: "1" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApproveClick(item);
                    }}
                    className="approve-btn"
                  >
                    <ThumbUpIcon style={{ color: "#287eb8" }} />
                  </button>
                  <button
                    style={{ flex: "1" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRejectClick(item);
                    }}
                    className="reject-btn"
                  >
                    <ThumbDownIcon style={{ color: "#f44336" }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {/* Approve Dialog */}
          <Dialog
            open={openApproveDialog}
            onClose={handleCloseApproveDialog}
            fullWidth
          >
            <DialogTitle>Project Details</DialogTitle>
            <DialogContent>
              {selectedItem && (
                <>
                  <div>
                    <strong>Title:</strong> {selectedItem.p_title}
                  </div>
                  <div>
                    <strong>Description:</strong> {selectedItem.p_description}
                  </div>
                  <div>
                    <strong>Tech Stack:</strong> {selectedItem.skill}
                  </div>
                  <div>
                    <strong>Skill Level:</strong> {selectedItem.s_skill}
                  </div>
                  <div>
                    <strong>Date:</strong>{" "}
                    {selectedItem.date
                      ? moment(selectedItem.date).format("DD/MM/YYYY")
                      : "No Date"}{" "}
                    <br />
                    <strong>Time:</strong>{" "}
                    {selectedItem.date
                      ? moment(selectedItem.date).format("HH:mm:ss")
                      : "No Time"}
                  </div>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseApproveDialog} color="primary">
                Close
              </Button>
              <Button onClick={handleApprove} color="primary">
                Confirm Approval
              </Button>
            </DialogActions>
          </Dialog>
          {/* Reject Dialog */}
          <Dialog
            open={openRejectDialog}
            onClose={handleCloseRejectDialog}
            fullWidth
          >
            <DialogTitle>Reject Skill</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Reason for Rejection"
                type="text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseRejectDialog} color="primary">
                Close
              </Button>
              <Button onClick={handleReject} color="primary">
                Confirm Rejection
              </Button>
            </DialogActions>
          </Dialog>
      </div>
    </div>
  );
}

export default Approvals;
