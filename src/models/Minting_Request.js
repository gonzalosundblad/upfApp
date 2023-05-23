const db = require("../../database/models");

const Minting_request = {
  create: async function(req) {
    const newMintingRequestStatus = await db.minting_request_status.findOne({
      where: { status: 'created' }
    });
    const newMintingRequest = await db.minting_request.create({
      user_id: req.session.userLogged.user_id,
      name: req.body.name || 'no name',
      status_id: newMintingRequestStatus.id_status
    });
    return newMintingRequest.minting_request_id;
  },
  findByEnterprise: async (user_id) => {
    return await db.minting_request.findAll({
    where: { user_id: user_id },
    include: [{all: true}]
  })},
  listAllWithFk: async () => {
    return await db.minting_request.findAll({
    include: [{all: true}]
  })},
  list: async() => {
    return await db.minting_request.findAll();
  },
  findByPk: async (minting_request_id) => {
    return await db.minting_request.findByPk(minting_request_id,
      {
        include: [{all: true}]
      }
    );
  },
  findMintingRequestStatus: async (minting_request_id) => {
    return await db.sequelize.query(
      `
      select
        b.status
      from
        minting_request a
      inner join
        minting_request_status b
      on
        a.status_id = b.id_status
      where
        a.minting_request_id = ?
      ;`,
    { replacements: [minting_request_id], type: db.Sequelize.QueryTypes.SELECT });
  },
  getStatus: async function(e){
    return await db.minting_request_status.findOne({
      attributes: ['id_status'],
      where: { status: e },
    });
  },
  findByStatusQuery: async function(status){
    return await db.sequelize.query(
      `select
        *
      from
        minting_request
      where
        status_id = (
          select
            id_status
          from
            minting_request_status
          where
            status = ?
        );`,
    { replacements: [status], type: db.Sequelize.QueryTypes.SELECT });
  },
  findByStatus: async function(status){
    const { dataValues: { id_status } } = await this.getStatus(status);
    return await db.minting_request.findAll()},
  changeMintingRequestName: async (req) => {
    return await db.minting_request.update({
      name: req.body.newName,
    },
    {
      where: { minting_request_id: req.params.minting_request_id },
    });
  },
  updateMintingRequestStatus: async (id, status) => {
    return await db.minting_request.update({
      status_id: status,
    },
    {
      where: { minting_request_id: id },
    });
  }
};

module.exports = Minting_request;
