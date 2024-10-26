import React, { useState, useEffect } from 'react';
import CustomTextField from '../../components/TextBox/customTextfield';
import Button from '@mui/material/Button';
import Select from 'react-select';
import customStyles from '../../components/applayout/selectTheme';
import requestApi from '../../components/utils/axios';
import { decryptData } from '../../components/utils/encrypt';

function Details() {
    const [formValues, setFormValues] = useState({
        dropdown1: [],
        dropdown2: null,
        title: '',
        description: '',
        image: ''
    });
    const encryptedData = localStorage.getItem('D!');
    const decryptedData = decryptData(encryptedData);
    const {reg_no:roll } = decryptedData; 
    console.log(roll)
    const [skillOptions, setSkillOptions] = useState([]);
    const levelOptions = [
        { value: 'BEGINNER', label: 'BEGINNER' },
        { value: 'INTERMEDIATE', label: 'INTERMEDIATE' },
        { value: 'ADVANCED', label: 'ADVANCED' }
    ];

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await requestApi("GET", '/skill');
                const options = response.data.map((item) => ({
                    value: item.skill,
                    label: item.skill
                }));
                setSkillOptions(options);
            } catch (error) {
                console.error("Error fetching skills:", error);
            }
        };
        fetchSkills();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleDropdownChange = (name, selectedOption) => {
        setFormValues({ ...formValues, [name]: selectedOption });
    };

    const handleReset = () => {
        setFormValues({
            dropdown1: [],
            dropdown2: null,
            title: '',
            description: '',
            image: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedSkills = formValues.dropdown1.map((option) => option.label).join(',');

        const payload = {
            student: roll, 
            skill: selectedSkills,
            p_title: formValues.title,
            p_description: formValues.description,
            p_image: formValues.image,
            s_skill: formValues.dropdown2?.value
        };

        try {
            const response = await requestApi("POST", '/stu-skill', payload);
            console.log("Submission response:", response.data);
        } catch (error) {
            console.error("Error submitting skills:", error);
        }
    };

    return (
        <div>
            <h2>Skills Set</h2>
            <form onSubmit={handleSubmit}>
                <Select
                    options={skillOptions}
                    value={formValues.dropdown1}
                    onChange={(option) => handleDropdownChange('dropdown1', option)}
                    placeholder="Select Skills"
                    styles={customStyles}
                    isMulti
                />
              
                <CustomTextField
                    label="Project Title"
                    name="title"
                    value={formValues.title}
                    onChange={handleChange}
                    size="small"
                />
                <CustomTextField
                    label="Project Description"
                    name="description"
                    value={formValues.description}
                    size="small"
                    onChange={handleChange}
                    multiline
                    rows={4}
                />
                <CustomTextField
                    label="Image URL"
                    name="image"
                    value={formValues.image}
                    size="small"
                    onChange={handleChange}
                />
                <Select
                    options={levelOptions}
                    value={formValues.dropdown2}
                    onChange={(option) => handleDropdownChange('dropdown2', option)}
                    styles={customStyles}
                    placeholder="Select Skill Level"
                />
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
                <Button type="button" onClick={handleReset} variant="outlined" color="secondary" style={{ marginLeft: '10px' }}>
                    Reset
                </Button>
            </form>
        </div>
    );
}

export default Details;
