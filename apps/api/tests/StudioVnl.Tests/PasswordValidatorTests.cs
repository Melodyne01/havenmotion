using StudioVnl.Application.Dtos;
using StudioVnl.Application.Validation;
using Xunit;

namespace StudioVnl.Tests;

public class PasswordValidatorTests
{
    [Fact]
    public void ChangePassword_accepts_a_new_long_password()
    {
        var result = new ChangePasswordValidator().Validate(new ChangePasswordRequest("HeavenMotion2026!", "MonNouveau2026x"));
        Assert.True(result.IsValid);
    }

    [Fact]
    public void ChangePassword_rejects_same_password()
    {
        var result = new ChangePasswordValidator().Validate(new ChangePasswordRequest("MonNouveau2026x", "MonNouveau2026x"));
        Assert.False(result.IsValid);
    }

    [Fact]
    public void ChangePassword_rejects_short_password()
    {
        var result = new ChangePasswordValidator().Validate(new ChangePasswordRequest("HeavenMotion2026!", "Court1"));
        Assert.False(result.IsValid);
    }

    [Fact]
    public void ForgotPassword_requires_an_email()
    {
        Assert.False(new ForgotPasswordValidator().Validate(new ForgotPasswordRequest("pas-un-email")).IsValid);
        Assert.True(new ForgotPasswordValidator().Validate(new ForgotPasswordRequest("admin@heavenmotion.be")).IsValid);
    }

    [Fact]
    public void ResetPassword_requires_token_and_long_password()
    {
        var validator = new ResetPasswordValidator();
        Assert.False(validator.Validate(new ResetPasswordRequest("admin@heavenmotion.be", "", "MonNouveau2026x")).IsValid);
        Assert.False(validator.Validate(new ResetPasswordRequest("admin@heavenmotion.be", "jeton", "court")).IsValid);
        Assert.True(validator.Validate(new ResetPasswordRequest("admin@heavenmotion.be", "jeton", "MonNouveau2026x")).IsValid);
    }
}
