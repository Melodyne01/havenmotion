using FluentValidation;

namespace StudioVnl.Api.Endpoints;

/// <summary>Applique le validateur FluentValidation du corps de requête.</summary>
public class ValidationFilter<T>(IValidator<T> validator) : IEndpointFilter
    where T : class
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        var argument = context.Arguments.OfType<T>().FirstOrDefault();
        if (argument is null)
        {
            return Results.Problem(statusCode: StatusCodes.Status400BadRequest, title: "Corps de requête manquant.");
        }

        var result = await validator.ValidateAsync(argument, context.HttpContext.RequestAborted);
        if (!result.IsValid)
        {
            return Results.ValidationProblem(result.ToDictionary());
        }
        return await next(context);
    }
}
