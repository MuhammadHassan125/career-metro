import React, { useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, Typography, Box, Divider, Button } from '@mui/material';
import useFetch from 'point-fetch-react';
import { useParams } from 'react-router-dom';
import Loading from "../../Components/Loading";
import { Snackbar } from '../../Utils/SnackbarUtils';
import { baseURL } from '../../Utils/contants';

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

    if (permissionIds.length === 0) {
      Snackbar("Please select at least one permission.", { variant: 'error' });
      return;
    }

    if (!roleId) {
      Snackbar("Role ID is missing.", { variant: 'error' });
      return;
    }

    const token = localStorage.getItem('user-visited-dashboard');

    try {
      const response = await fetch(`${baseURL}/assign-permissions-to-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          roleId: roleId,
          permissionIds: permissionIds,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Snackbar("Permissions updated successfully", {
          variant: "success",
          style: { backgroundColor: "var(--primary-btn-color)" },
        });
      } else {
        alert("Failed to update permissions");
      }
    } catch (error) {
      Snackbar("An error occurred while updating permissions", { variant: 'error' });
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
                      checked={permission.status}
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
            border: 'none',
            outline: 'none',
            borderRadius: '5px'
          }}>

          Save Changes
        </button>
      </Box>
    </>
  );
};

export default AdminEditPermission;
