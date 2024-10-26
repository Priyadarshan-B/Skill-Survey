const  {query}  = require("../../config/query");

exports.get_resource = async (req, res) =>{
const {role} = req.body
if(!role){
 return res.status(400).json({error:"Role id is required"})
}
try{
  const sql = `
  SELECT rs.name, rs.icon, rs.path, rs.order_by
  FROM role r
  JOIN resources rs ON FIND_IN_SET(rs.id, r.resources)
  WHERE r.id =?
  AND rs.status = '1' 
  ORDER BY order_by
`
const resource = await query(sql, [role])
res.status(200).json(resource)
}
catch(err){
  console.error("Error fetching resources", err);
  res.status(500).json({ error: "Error fetching resources" });
}

}