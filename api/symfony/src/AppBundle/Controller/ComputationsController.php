<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use AppBundle\Resolver\ComputationResolver;
use AppBundle\Finisher\ComputationFinisher;
use AppBundle\Manager\ComputationManager;
use FOS\RestBundle\Controller\Annotations as FOS;
use Nelmio\ApiDocBundle\Annotation as Nelmio;
use FOS\RestBundle\Request\ParamFetcher;
use AppBundle\Entity\Computation;

/**
 * Class ComputationsController
 * @package AppBundle\Controller
 */
class ComputationsController
{

    /**
     * @var ValidatorInterface
     */
    private $validator;

    /**
     * @var ComputationResolver
     */
    private $computationResolver;

    /**
     * @var ComputationFinisher
     */
    private $computationFinisher;

    /**
     * @var ComputationManager
     */
    private $computationManager;

    /**
     * @var RequestStack
     */
    private $requestStack;

    /**
     * @param ValidatorInterface $validator
     * @param ComputationResolver $computationResolver
     * @param ComputationFinisher $computationFinisher
     * @param ComputationManager $computationManager
     * @param RequestStack $requestStack
     */
    public function __construct(
        ValidatorInterface $validator,
        ComputationResolver $computationResolver,
        ComputationFinisher $computationFinisher,
        ComputationManager $computationManager,
        RequestStack $requestStack
    )
    {
        $this->validator = $validator;
        $this->computationResolver = $computationResolver;
        $this->computationFinisher = $computationFinisher;
        $this->computationManager = $computationManager;
        $this->requestStack = $requestStack;
    }

    /**
     * @FOS\RequestParam(
     *     name="scheme",
     *     strict=true,
     *     allowBlank=false
     * )
     * @FOS\RequestParam(
     *     name="aEncrypted",
     *     requirements="\d+",
     *     strict=true,
     *     allowBlank=false
     * )
     * @FOS\RequestParam(
     *     name="bEncrypted",
     *     requirements="\d+",
     *     strict=true,
     *     allowBlank=false
     * )
     * @FOS\RequestParam(
     *     name="publicKey",
     *     array=true,
     *     strict=true,
     *     allowBlank=false
     * )
     * @FOS\RequestParam(
     *     name="stages",
     *     array=true,
     *     strict=true,
     *     allowBlank=false
     * )
     *
     * @param ParamFetcher $paramFetcher
     *
     * @return Computation
     */
    public function postComputationsAction(ParamFetcher $paramFetcher)
    {
        $params = $paramFetcher->all();
        $ipAddress = $this->requestStack->getCurrentRequest()->getClientIp();

        $computation = $this->computationResolver->fromArrayAndIpAddress($params, $ipAddress);

        $errors = $this->validator->validate($computation);
        if (count($errors) > 0) {
            throw new BadRequestHttpException();
        }

        $computation = $this->computationFinisher->finishComputation($computation);

        $computation = $this->computationManager->save($computation);

        return $computation;
    }

}
