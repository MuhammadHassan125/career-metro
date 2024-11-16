import React, { useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, Typography, Box, Divider, Button } from '@mui/material';
import useFetch from 'point-fetch-react';
import { useParams } from 'react-router-dom';
import Loading from "../../Components/Loading";

const AdminEditPermission = () => {
  const [data, setData] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const { get, post, Processing } = useFetch({ state: {} });
  const params = useParams();

  useEffect(() => {
    setRoleId(params?.id);
  }, [params]);

  useEffect(() => {
    if (roleId) {
      getRolesEdit();
    }
  }, [roleId]);

  const getRolesEdit = () => {
    get({
      endPoint: `/get-all-permissions-with-role/${roleId}`,
      onSuccess: (res) => {
        setData(res?.data?.data);
      },
      onError: (err) => {
        console.log(err);
      }
    });
  };

  const handleCheckboxChange = (moduleIndex, permissionIndex) => {
    const updatedData = [...data];
    const permission = updatedData[moduleIndex].permissions[permissionIndex];
    permission.status = !permission.status;

    setData(updatedData);
  };

  const handleSaveChanges = async () => {
    const permissionIds = [];
    data.forEach(module => {
      module.permissions.forEach(permission => {
        if (permission.status) { 
          permissionIds.push(permission.permissionId);
        }
      });
    });

    // Check if permissionIds is not empty before sending the request
    if (permissionIds.length === 0) {
      alert("Please select at least one permission.");
      return;
    }

    // Ensure roleId is available before sending the request
    if (!roleId) {
      alert("Role ID is missing.");
      return;
    }

    // Get the token (assuming you're storing it in localStorage or any other method)
    const token = localStorage.getItem('user-visited-dashboard'); // Adjust this based on where you're storing the token

    // Send data to API with roleId and permissionIds
    try {
      const response = await fetch('http://192.168.18.195:8001/api/assign-permissions-to-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Adding the token to the headers
        },
        body: JSON.stringify({
          roleId: roleId, // Sending the roleId from state
          permissionIds: permissionIds, // Sending permissionIds array
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Permissions updated successfully:", result);
        alert("Permissions updated successfully");
      } else {
        console.log("Error:", result);
        alert("Failed to update permissions");
      }
    } catch (error) {
      console.log("Error occurred during fetch:", error);
      alert("An error occurred while updating permissions");
    }
  };

  return (
    <>
    {Processing ? <Loading processing={Processing} /> : null}
    <Box sx={{ padding: '20px' }}>
      {Array.isArray(data) && data.map((module, moduleIndex) => (
        <Box key={module.moduleName} sx={{ marginBottom: '20px' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            {module.moduleName}
          </Typography>
          <Divider sx={{ marginBottom: '10px' }} />
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {module.permissions.map((permission, permissionIndex) => (
              <FormControlLabel
                key={permission.permissionId}
                control={
                  <Checkbox
                    checked={permission.status} // Check based on the permission's status
                    onChange={() => handleCheckboxChange(moduleIndex, permissionIndex)}
                    color="primary"
                  />
                }
                label={permission.permissionName}
                sx={{ marginRight: '10px', marginBottom: '5px' }}
              />
            ))}
          </Box>
        </Box>
      ))}
      <button 
        onClick={handleSaveChanges}
        style={{
          backgroundColor: '#879aad',
          color: '#E8E8E8',
          fontSize: '12px',
          padding: '6px 12px',
          cursor: 'pointer',
          border:'none',
          outline:'none',
          borderRadius:'5px'
      }}>
      
        Save Changes
      </button>
    </Box>
    </>
      );
};

export default AdminEditPermission;
