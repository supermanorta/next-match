CREATE PROCEDURE  [dbo].[DockerDoor]
	-- Add the input parameters for the stored procedure here
	@LocationID int,
	@Description varchar(50),
	@EnabledSW char(1),

	-- Add the output parameters for the stored procedure here
	@ResultCode int output,		-- a value of zero represents success
	@ResultText varchar(1000) output	-- description of error that is trapped

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from interfering with SELECT statements.
	SET NOCOUNT ON;
	SET @ResultCode = 0
	SET @ResultText = ''

	-- Declare variables here
	DECLARE @Result int;

	BEGIN TRY
    -- Insert statements for procedure here	
	SELECT @Result = COUNT(des)
	FROM 	dock_door_defn
	WHERE (des = @Description) AND (loc_id = @LocationID)

	-- if it does not exist then create it
	IF @Result = 0
	BEGIN
		INSERT INTO dock_door_defn
			([des],
			[enbld_sw],
			[loc_id])
		VALUES 
			(@Description,
			@EnabledSW,
			@LocationID)
	END
	
	-- End statements for procedure
	END TRY

	-- Error Handling
	BEGIN CATCH
	SELECT @ResultCode = Error_Number()
	SELECT @ResultText = Error_Message()
	END CATCH
END
go