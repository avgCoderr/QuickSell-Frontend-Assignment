import React, { useEffect, useState } from "react";
import { Box, Grid, styled, Paper } from "@mui/material";
import { useAppState } from "../AppStateContext";
import axios from "axios";

import TicketGroupStatus from "./TicketGroupStatus";
import TicketGroupUser from "./TicketGroupUser";

import inProgressIcon from "../assets/work-in-progress.png";
import backlogIcon from "../assets/Daco_4816812.png";
import cancelIcon from "../assets/cancel-button.png";
import doneIcon from "../assets/PngItem_5284486.png";
import todoIcon from "../assets/pngwing.com.png";

import SignalCellular4BarIcon from "@mui/icons-material/SignalCellular4Bar";
import SignalCellular3BarIcon from "@mui/icons-material/SignalCellular3Bar";
import SignalCellular1BarIcon from "@mui/icons-material/SignalCellular1Bar";
import ErrorTwoToneIcon from "@mui/icons-material/ErrorTwoTone";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const statusIcons = {
  Backlog: backlogIcon,
  Todo: todoIcon,
  "In progress": inProgressIcon,
  Done: doneIcon,
  Canceled: cancelIcon,
};

const priorityIcons = {
  4: (
    <Paper style={{ marginRight: "0.3rem" }}>
      <ErrorTwoToneIcon
        style={{ fontSize: "14px", padding: "0.3rem 0.3rem 0.1rem 0.3rem" }}
      />
    </Paper>
  ),
  3: (
    <Paper style={{ marginRight: "0.3rem" }}>
      <SignalCellular4BarIcon
        style={{ fontSize: "14px", padding: "0.3rem 0.3rem 0.1rem 0.3rem" }}
      />
    </Paper>
  ),
  2: (
    <Paper style={{ marginRight: "0.3rem" }}>
      <SignalCellular3BarIcon
        style={{ fontSize: "14px", padding: "0.3rem 0.3rem 0.1rem 0.3rem" }}
      />
    </Paper>
  ),
  1: (
    <Paper style={{ marginRight: "0.3rem" }}>
      <SignalCellular1BarIcon
        style={{ fontSize: "14px", padding: "0.3rem 0.3rem 0.1rem 0.3rem" }}
      />
    </Paper>
  ),
  0: (
    <Paper style={{ marginRight: "0.3rem" }}>
      <MoreHorizIcon
        style={{ fontSize: "14px", padding: "0.3rem 0.3rem 0.1rem 0.3rem" }}
      />
    </Paper>
  ),
};

const statusValues = ["Backlog", "Todo", "In progress", "Done", "Canceled"];

const priorityValues = [4, 3, 2, 1, 0];

const MainContainer = styled(Grid)({
  /* ... */
});

const priorityLabels = {
  4: "Urgent",
  3: "High",
  2: "Medium",
  1: "Low",
  0: "No priority",
};

const Home = () => {
  const { selectedOptions } = useAppState();
  const [data, setData] = useState({
    tickets: [],
    users: [],
  });

  useEffect(() => {
    // Fetch data using Axios
    axios
      .get("https://apimocha.com/quicksell/data")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // group basis status
  const groupedTickets_status = {};
  data.tickets.forEach((ticket) => {
    if (!groupedTickets_status[ticket.status]) {
      groupedTickets_status[ticket.status] = [];
    }
    groupedTickets_status[ticket.status].push(ticket);
  });

  // group basis user
  const groupedTickets_user = {};
  data.tickets.forEach((ticket) => {
    if (!groupedTickets_user[ticket.userId]) {
      groupedTickets_user[ticket.userId] = [];
    }
    groupedTickets_user[ticket.userId].push(ticket);
  });

  // group basis priority
  const groupedTickets_priority = {};
  data.tickets.forEach((ticket) => {
    if (!groupedTickets_priority[ticket.priority]) {
      groupedTickets_priority[ticket.priority] = [];
    }
    groupedTickets_priority[ticket.priority].push(ticket);
  });
  //

  // sorting basis title
  const compareTitles = (a, b) => {
    return a.title.localeCompare(b.title);
  };

  if (selectedOptions.ordering === "title") {
    for (const status in groupedTickets_status) {
      groupedTickets_status[status].sort(compareTitles);
    }
    for (const user in groupedTickets_user) {
      groupedTickets_user[user].sort(compareTitles);
    }
    for (const priority in groupedTickets_priority) {
      groupedTickets_priority[priority].sort(compareTitles);
    }
  }
  //

  // sorting basis priority
  const comparePriority = (a, b) => {
    return a.priority - b.priority;
  };

  if (selectedOptions.ordering === "priority") {
    for (const status in groupedTickets_status) {
      groupedTickets_status[status].sort(comparePriority);
    }
    for (const user in groupedTickets_user) {
      groupedTickets_user[user].sort(comparePriority);
    }
    for (const priority in groupedTickets_priority) {
      groupedTickets_priority[priority].sort(comparePriority);
    }
  }
  //

  return (
    <Box
      style={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <MainContainer container>
        {selectedOptions.grouping === "status" ? (
          <TicketGroupStatus
            data={data}
            groupedTickets_status={groupedTickets_status}
            priorityIcons={priorityIcons}
            statusIcons={statusIcons}
            statusValues={statusValues}
          />
        ) : null}

        {selectedOptions.grouping === "user" ? (
          <TicketGroupUser
            data={data}
            groupedTickets_user={groupedTickets_user}
            priorityIcons={priorityIcons}
            statusIcons={statusIcons}
            statusValues={statusValues}
          />
        ) : null}

        {selectedOptions.grouping === "priority"
          ? priorityValues.map((priority) => (
              <Grid item lg={2.4} key={priority}>
                <div>
                  <h2>{priorityLabels[priority]}</h2>
                  <ul>
                    {groupedTickets_priority[priority]
                      ? groupedTickets_priority[priority].map((ticket) => (
                          <li key={ticket.id}>{ticket.title}</li>
                        ))
                      : null}
                  </ul>
                </div>
              </Grid>
            ))
          : null}
      </MainContainer>
    </Box>
  );
};

export default Home;